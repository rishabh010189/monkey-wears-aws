import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { errorResponse, successResponse } from '../src/utils/response';
import { streamToString } from '../src/utils/streamToString';
import { IProduct } from '../src/interfaces/Products.interface';

const s3 = new S3Client({});

const BUCKET_NAME = process.env.BUCKET_NAME!;
const FILE_KEY = 'products.json';

export const handler = async (event: APIGatewayProxyEventV2) => {
  const origin = event.headers.origin;
  const productId = event.pathParameters?.productId;

  console.log(`ProductId---->${productId}`);

  if (!productId) {
    return errorResponse('Product Id is required', origin, 400);
  }

  const response = await s3.send(
    new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: FILE_KEY,
    }),
  );

  const data = JSON.parse(await streamToString(response.Body));

  const productDetails = data.find((i: IProduct) => i.id == productId);

  console.log(`productDetails---->${JSON.stringify(productDetails)}`);

  if (!productDetails) {
    return errorResponse('Product not found', origin, 404);
  }

  return successResponse(productDetails, origin);
};
