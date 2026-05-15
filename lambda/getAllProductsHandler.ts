import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { successResponse } from '../src/utils/response';
import { getJsonFile } from '../src/shared/file-service/fileRepository';
import { IProduct } from 'aws-cdk-lib/aws-servicecatalog';

const FILE_KEY = 'products.json';

export const handler = async (event: APIGatewayProxyEventV2) => {
  const origin = event.headers.origin;
  const category = event.queryStringParameters?.category;

  const data = await getJsonFile<IProduct[]>(FILE_KEY);

  let filteredData = data;

  if (category) {
    filteredData = data.filter(
      (item: any) => item.category?.toLowerCase() === category.toLowerCase(),
    );
  }

  return successResponse(filteredData, origin);
};
