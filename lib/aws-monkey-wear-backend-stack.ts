import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambdaNode from "aws-cdk-lib/aws-lambda-nodejs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class AwsMonkeyWearBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // 🪣 S3 Bucket
    const bucket = new s3.Bucket(this, "ProductBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY, // dev only
      autoDeleteObjects: true,
    });

    // ⚡ Lambda (auto-bundled, no zip needed)
    const fn = new lambdaNode.NodejsFunction(this, "GetProductsFn", {
      runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
      entry: "lambda/getAllProductsHandler.ts",
      handler: "handler",
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    // 🔐 Grant Lambda access to S3
    bucket.grantRead(fn);

    // 🌐 API Gateway
    const api = new apigateway.RestApi(this, "ProductsApi");

    const products = api.root.addResource("products");

    products.addMethod("GET", new apigateway.LambdaIntegration(fn));
  }
}
