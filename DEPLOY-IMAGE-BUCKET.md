# Deploy Private Presigned Images to S3 (ECS)

Ce guide décrit exactement les étapes pour déployer le backend avec des images **privées** sur S3 et des URLs **presignées** retournées par l'API.

## 1) Prérequis

- Un bucket S3 existant (exemple: `cloud-nova-images`) dans la même région que ECS (recommandé).
- Un repository ECR existant (exemple: `682405976856.dkr.ecr.eu-west-1.amazonaws.com/nova/core`).
- Un cluster/service ECS Fargate existant derrière ALB.
- Un rôle IAM utilisé comme **Task Role** (exemple: `ecsTaskRole`).
- AWS CLI + Docker Desktop installés localement.

## 2) Variables d'environnement nécessaires (ECS Task Definition)

Configurer ces variables dans le conteneur ECS:

- `DRIVE_DISK=s3`
- `AWS_REGION=eu-west-1`
- `S3_BUCKET=cloud-nova-images`
- `PORT=8080`
- `HOST=0.0.0.0`

Ne pas définir (ou laisser vide) en prod ECS avec Task Role IAM:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `S3_ENDPOINT` (uniquement pour MinIO/LocalStack)

## 3) Configuration IAM (Task Role)

Important: ajouter les permissions sur le **Task Role** (`ecsTaskRole`), pas sur `AWSServiceRoleForECS`.

Dans IAM > Roles > `ecsTaskRole` > `Autorisations` > ajouter une policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListBucket",
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::cloud-nova-images"
    },
    {
      "Sid": "MediaObjectsRW",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::cloud-nova-images/*"
    }
  ]
}
```


Policy (uploads write + resized read-only):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListBucket",
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::cloud-nova-images"
    },
    {
      "Sid": "UploadsWrite",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::cloud-nova-images/uploads/*"
    },
    {
      "Sid": "ResizedReadOnly",
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::cloud-nova-images/resized/*"
    }
  ]
}
```

## 4) Configuration Bucket S3 (privé)

- Bucket: `cloud-nova-images`
- **Block Public Access: ON**
- Pas de policy publique (`Principal: "*"` interdit)

Policy de compartiment :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadOriginals",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::682405976856:role/service-role/nova-image-resizer-role-i6qn8cmd"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::cloud-nova-images/uploads/*"
    },
    {
      "Sid": "WriteResized",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::682405976856:role/service-role/nova-image-resizer-role-i6qn8cmd"
      },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::cloud-nova-images/resized/*"
    },
    {
      "Sid": "EcsUploadsWriteReadDelete",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::682405976856:role/ecsTaskRole"
      },
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::cloud-nova-images/uploads/*"
    },
    {
      "Sid": "EcsReadResized",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::682405976856:role/ecsTaskRole"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::cloud-nova-images/resized/*"
    }
  ]
}
```

## 5) Build et Push de l'image vers ECR

```bash
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 682405976856.dkr.ecr.eu-west-1.amazonaws.com

docker build -t nova-core:private-s3 .
docker tag nova-core:private-s3 682405976856.dkr.ecr.eu-west-1.amazonaws.com/nova/core:private-s3-v1
docker push 682405976856.dkr.ecr.eu-west-1.amazonaws.com/nova/core:private-s3-v1
```

Notes:

- `eu-west-1` doit être la région de votre repo ECR.
- Le tag versionné (`private-s3-v1`, `private-s3-YYYYMMDD-HHMM`) est recommandé.

## 6) Mise à jour ECS

1. Créer une nouvelle révision de Task Definition.
2. Mettre à jour:
   - Image conteneur vers `.../nova/core:private-s3-v1`
   - Mapping port conteneur: `8080/TCP`
   - Variables d'environnement listées plus haut
   - `taskRoleArn` = rôle avec policy S3
3. Mettre à jour le service ECS vers cette nouvelle révision.
4. Forcer un nouveau déploiement.

## 7) Ce que le code fait maintenant

- Upload S3 en visibilité `private` sous le préfixe `uploads/`
- Stockage DB en **clé objet** (pas URL publique), ex: `uploads/posts/<uuid>.png`
- Lecture API: priorité au fichier `resized/...` (si disponible), sinon fallback sur `uploads/...`
- API retourne des URLs **presignées** (TTL 15 min) pour `avatar` / `image`
- Compatibilité legacy: anciennes URLs publiques encore gérées (lazy migration)

### Flow cible image (upload -> resize -> read)

1. Le backend upload dans `uploads/...` (privé)
2. L'événement S3 déclenche la Lambda resizer
3. La Lambda écrit l'image optimisée dans `resized/...`
4. Lors d'un GET API, le backend:
   - tente `resized/...`
   - fallback `uploads/...` si le resized n'existe pas encore
5. Le frontend reçoit toujours une URL presignée via le même champ (`image`/`avatar`)

## 8) Vérifications post-déploiement

1. Appeler un endpoint d'upload (avatar/post/event/shop item).
2. Vérifier dans S3 que l'objet est créé.
3. Vérifier que l'API renvoie une URL contenant `X-Amz-Signature` et `X-Amz-Expires=900`.
4. Vérifier qu'une URL S3 non signée retourne `403 AccessDenied`.
5. Attendre expiration (~15 min), vérifier que l'ancienne URL échoue, puis refetch API pour obtenir une nouvelle URL.

## 9) Dépannage rapide

- `AccessDenied` sur upload:
  - vérifier que la policy est sur le **Task Role**
  - vérifier `S3_BUCKET` et `AWS_REGION`
  - vérifier que le service ECS tourne bien avec la nouvelle révision

- Le conteneur ne démarre pas:
  - vérifier `PORT=8080` et mapping port 8080 dans ECS
  - vérifier logs CloudWatch

- Push Docker impossible:
  - démarrer Docker Desktop (daemon actif)
  - relancer login ECR puis build/tag/push
