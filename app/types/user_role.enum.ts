export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  USER = 'user',
}

export const rolesHierarchy: Record<UserRole, UserRole[]> = {
  [UserRole.SUPERADMIN]: [UserRole.ADMIN, UserRole.USER],
  [UserRole.ADMIN]: [UserRole.USER],
  [UserRole.USER]: [],
}
