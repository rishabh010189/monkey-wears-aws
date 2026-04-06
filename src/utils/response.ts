import { APIGatewayProxyResult } from 'aws-lambda';

// setup CORS header
const allowedOrigins = ['http://localhost:5173', 'https://yourdomain.com'];

const getHeaders = (origin = '') => {
  const isOriginAllowed = allowedOrigins.includes(origin);
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': isOriginAllowed ? origin : '',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  };
};

export const successResponse = (
  data: unknown,
  origin?: string,
  statusCode = 200,
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: getHeaders(origin),
    body: JSON.stringify(data),
  };
};

export const errorResponse = (
  message: string,
  origin?: string,
  statusCode = 500,
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: getHeaders(origin),
    body: JSON.stringify({
      error: message,
    }),
  };
};

export const optionsResponse = (origin?: string): APIGatewayProxyResult => {
  return {
    statusCode: 200,
    headers: getHeaders(origin),
    body: '',
  };
};
