import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { errorResponse, successResponse } from '../../src/utils/response';
import { getJsonFile } from '../../src/shared/file-service/fileRepository';
import { IPlaceOrderRequestBody } from '../../src/interfaces/PlaceOrder.interface';

const ORDERS_FILE_KEY = 'orders/orders.json';

export const handler = async (event: APIGatewayProxyEventV2) => {
  const origin = event.headers.origin;

  try {
    const order = JSON.parse(event.body || '{}') as IPlaceOrderRequestBody;
    const { firstName, email, phone, addressLine1, city, state, pincode, paymentMethod } = order;

    const newOrder = {
      orderId: `MW-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'PLACED',
      firstName,
      email,
      phone,
      addressLine1,
      city,
      state,
      pincode,
      paymentMethod,
    };

    let existingOrders: any[] = [];

    try {
      const existingFile = await getJsonFile<any>(ORDERS_FILE_KEY);
      existingOrders = JSON.parse(existingFile);
    } catch (error: any) {
      // File doesn't exist yet
      if (error.name !== 'NoSuchKey' && error.$metadata?.httpStatusCode !== 404) {
        throw error;
      }
    }

    existingOrders.push(newOrder);
    console.log('SUCCESS');
    console.log(existingOrders);
    return successResponse(newOrder, origin);
  } catch (err) {
    console.error('PLACE_ORDER_ERROR', err);
    return errorResponse('Something went wrong', origin, 500);
  }
};
