import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambdaNode from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class AwsMonkeyWearBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 🪣 S3 Bucket
    const bucket = new s3.Bucket(this, 'ProductBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY, // dev only
      autoDeleteObjects: true,
    });

    // ======================
    // ⚡Lambdas
    // ======================
    const fn = new lambdaNode.NodejsFunction(this, 'GetProductsFn', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
      entry: 'lambda/getAllProductsHandler.ts',
      handler: 'handler',
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    const productDetailsLambda = new lambdaNode.NodejsFunction(this, 'GetProductsByIdFn', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
      entry: 'lambda/getProductByIdHandler.ts',
      handler: 'handler',
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    const searchLambda = new lambdaNode.NodejsFunction(this, 'SearchFn', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
      entry: 'lambda/search/searchHandler.ts',
      handler: 'handler',
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    const placeOrderLambda = new lambdaNode.NodejsFunction(this, 'PlaceOrderFn', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
      entry: 'lambda/placeOrder/placeOrderHandler.ts',
      handler: 'handler',
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    // ======================
    // 🔐 Permissions
    // ======================
    bucket.grantRead(fn);
    bucket.grantRead(productDetailsLambda);
    bucket.grantRead(searchLambda);
    bucket.grantRead(placeOrderLambda);

    // ======================
    // 🌐API Gateway
    // ======================
    const api = new apigateway.RestApi(this, 'MonkeyWearsApi');

    // /products
    const products = api.root.addResource('products');
    products.addMethod('GET', new apigateway.LambdaIntegration(fn));

    // /products/{productId}
    const productById = products.addResource('{productId}');
    productById.addMethod('GET', new apigateway.LambdaIntegration(productDetailsLambda));

    // /search?q
    const search = api.root.addResource('search');
    search.addMethod('GET', new apigateway.LambdaIntegration(searchLambda));

    // /placeOrder
    const placeOrder = api.root.addResource('placeOrder');
    placeOrder.addMethod('POST', new apigateway.LambdaIntegration(placeOrderLambda));
  }
}
