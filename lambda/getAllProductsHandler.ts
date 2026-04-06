import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { optionsResponse, successResponse } from '../src/utils/response';

const s3 = new S3Client({});

const BUCKET_NAME = process.env.BUCKET_NAME!;
const FILE_KEY = 'products.json';

const streamToString = async (stream: any): Promise<string> => {
  return await new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk: any) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
};

export const handler = async (event: APIGatewayProxyEventV2) => {
  const origin = event.headers.origin;
  const response = await s3.send(
    new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: FILE_KEY,
    }),
  );

  const data = JSON.parse(await streamToString(response.Body));
  return successResponse(data, origin);
};
