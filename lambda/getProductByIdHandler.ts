import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { errorResponse, successResponse } from '../src/utils/response';
import { IProduct } from '../src/interfaces/Products.interface';
import { getJsonFile } from '../src/shared/file-service/fileRepository';

const FILE_KEY = 'products.json';

export const handler = async (event: APIGatewayProxyEventV2) => {
  const origin = event.headers.origin;
  const productId = event.pathParameters?.productId;

  console.log(`ProductId---->${productId}`);

  if (!productId) {
    return errorResponse('Product Id is required', origin, 400);
  }

  const data = await getJsonFile<IProduct[]>(FILE_KEY);

  const productDetails = data.find((i: IProduct) => i.id == productId);

  console.log(`productDetails---->${JSON.stringify(productDetails)}`);

  if (!productDetails) {
    return errorResponse('Product not found', origin, 404);
  }

  return successResponse(productDetails, origin);
};
