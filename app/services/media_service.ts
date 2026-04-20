import drive from '@adonisjs/drive/services/main'

export class MediaService {
  public static readonly SIGNED_URL_TTL_SECONDS = 900
  private static readonly ROOT_UPLOAD_PREFIX = 'uploads/'
  private static readonly MANAGED_PREFIXES = [
    'uploads/',
    'resized/',
    'users/',
    'posts/',
    'events/',
    'shop_items/',
  ] as const

  public static buildObjectKey(prefix: string, fileName: string): string {
    const normalizedPrefix = prefix.replace(/^\/+|\/+$/g, '')
    const filePrefix = this.toFilePrefix(normalizedPrefix)
    return `${this.ROOT_UPLOAD_PREFIX}${filePrefix}-${fileName}`
  }

  public static resolveKey(storedValue?: string | null): string | null {
    if (!storedValue) {
      return null
    }

    const trimmedValue = storedValue.trim()
    if (!trimmedValue) {
      return null
    }

    try {
      const parsedUrl = new URL(trimmedValue)
      const pathname = decodeURIComponent(parsedUrl.pathname).replace(/^\/+/, '')
      const keyFromPath = this.extractManagedKey(pathname)
      if (keyFromPath) {
        return keyFromPath
      }
    } catch {}

    const keyFromRawValue = this.extractManagedKey(trimmedValue)
    if (keyFromRawValue) {
      return keyFromRawValue
    }

    return null
  }

  public static async putPrivateObject(
    key: string,
    contents: string | Uint8Array,
    contentType?: string
  ): Promise<void> {
    await drive.use('s3').put(key, contents, {
      contentType,
      visibility: 'private',
    })
  }

  public static async toResponseUrl(storedValue?: string | null): Promise<string | null> {
    if (!storedValue) {
      return null
    }

    const key = this.resolveKey(storedValue)
    if (!key) {
      return storedValue
    }

    try {
      const preferredKey = await this.resolvePreferredReadKey(key)
      return await drive.use('s3').getSignedUrl(preferredKey, {
        expiresIn: this.SIGNED_URL_TTL_SECONDS,
      })
    } catch {
      return storedValue
    }
  }

  public static async deleteByStoredValue(storedValue?: string | null): Promise<void> {
    const key = this.resolveKey(storedValue)
    if (!key) {
      return
    }

    await drive.use('s3').delete(key)
  }

  private static extractManagedKey(value: string): string | null {
    for (const prefix of this.MANAGED_PREFIXES) {
      const index = value.indexOf(prefix)
      if (index >= 0) {
        return value
          .slice(index)
          .replace(/^\/+/, '')
          .split('?')[0]
          .split('#')[0]
      }
    }

    return null
  }

  private static async resolvePreferredReadKey(key: string): Promise<string> {
    const resizedKey = this.toResizedKey(key)
    if (!resizedKey) {
      return key
    }

    const resizedExists = await drive.use('s3').exists(resizedKey)
    return resizedExists ? resizedKey : key
  }

  private static toResizedKey(key: string): string | null {
    if (!key.startsWith(this.ROOT_UPLOAD_PREFIX)) {
      return null
    }

    const fileName = key.slice(this.ROOT_UPLOAD_PREFIX.length)
    // const withoutExtension = fileName.replace(/\.[^.]+$/, '')
    return `resized/${fileName}`
  }

  private static toFilePrefix(prefix: string): string {
    const mapping: Record<string, string> = {
      users: 'user',
      posts: 'post',
      events: 'event',
      shop_items: 'shop-item',
    }

    return mapping[prefix] ?? prefix.replace(/_/g, '-').replace(/s$/, '')
  }
}
