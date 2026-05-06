import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { optionsResponse, successResponse } from '../src/utils/response';
import { streamToString } from '../src/utils/streamToString';

const s3 = new S3Client({});

const BUCKET_NAME = process.env.BUCKET_NAME!;
const FILE_KEY = 'products.json';

export const handler = async (event: APIGatewayProxyEventV2) => {
  const origin = event.headers.origin;
  const category = event.queryStringParameters?.category;

  const response = await s3.send(
    new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: FILE_KEY,
    }),
  );

  const data = JSON.parse(await streamToString(response.Body));

  let filteredData = data;

  if (category) {
    filteredData = data.filter(
      (item: any) => item.category?.toLowerCase() === category.toLowerCase(),
    );
  }

  return successResponse(filteredData, origin);
};
