import { App, Stack, StackProps } from 'aws-cdk-lib';
import { aws_s3 as s3, aws_lambda as lambda, aws_apigateway as apigateway, aws_dynamodb as dynamodb, aws_iam as iam, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class CdkProjectStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // S3 bucket configuration
    const bucket = new s3.Bucket(this, 'FileBucket', {
      removalPolicy: RemovalPolicy.DESTROY,  
      autoDeleteObjects: true,  
    });

    // DynamoDB table configuration
    const table = new dynamodb.Table(this, 'FileTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,  
    });

    // IAM role for Lambda function
    const lambdaRole = new iam.Role(this, 'LambdaExecRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'), 
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),  
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'),  
      ],
    });

    // Lambda function configuration
    const handler = new lambda.Function(this, 'Handler', {
      runtime: lambda.Runtime.NODEJS_20_X,  
      code: lambda.Code.fromAsset('lambda'),  
      handler: 'handler.handler', 
      environment: {
        BUCKET_NAME: bucket.bucketName,
        TABLE_NAME: table.tableName,
      },
      role: lambdaRole,
    });

    const api = new apigateway.LambdaRestApi(this, 'Api', {
      handler: handler, 
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token', 'X-Requested-With'],
        allowCredentials: true,
      }
    });

  }
}

const app = new App();
new CdkProjectStack(app, 'CdkProjectStack');
