import { App, Stack, StackProps, aws_s3 as s3, aws_lambda as lambda, aws_apigateway as apigateway, aws_dynamodb as dynamodb, aws_iam as iam, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class CdkProjectStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // S3 bucket configuration
    const bucket = new s3.Bucket(this, 'FileBucket', {
      removalPolicy: RemovalPolicy.DESTROY,  // Automatically clean up bucket when the stack is destroyed
      autoDeleteObjects: true,  // Automatically delete objects in the bucket when the bucket is deleted
    });

    // DynamoDB table configuration
    const table = new dynamodb.Table(this, 'FileTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,  // Cost-effective for unpredictable workloads
    });

    // IAM role for Lambda function
    const lambdaRole = new iam.Role(this, 'LambdaExecRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),  // Basic Lambda execution policy
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),  // Full access to S3
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'),  // Full access to DynamoDB
      ],
    });

    // Lambda function configuration
    const handler = new lambda.Function(this, 'Handler', {
      runtime: lambda.Runtime.NODEJS_20_X,  // Using the latest supported Node.js runtime
      code: lambda.Code.fromAsset('lambda'),  // Adjust the path to your Lambda code
      handler: 'handler.handler',  // Your handler file and export name
      environment: {  // Passing environment variables to the Lambda function
        BUCKET_NAME: bucket.bucketName,
        TABLE_NAME: table.tableName,
      },
      role: lambdaRole,
    });

    // Assuming 'handler' is your Lambda function already added to the CDK stack
    const api = new apigateway.LambdaRestApi(this, 'Api', {
      handler: handler,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      }
    });

  }
}

const app = new App();
new CdkProjectStack(app, 'CdkProjectStack');
