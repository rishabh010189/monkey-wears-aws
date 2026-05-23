import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({});

export async function getS3File(bucket: string, key: string) {
  const response = await s3.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );

  return response.Body;
}

type PutJsonFileToS3Params<T> = {
  bucketName: string;
  fileKey: string;
  data: T;
};

export const putJsonFileToS3 = async <T>({
  bucketName,
  fileKey,
  data,
}: PutJsonFileToS3Params<T>) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,

      Body: JSON.stringify(data, null, 2),

      ContentType: 'application/json',
    }),
  );

  return true;
};
