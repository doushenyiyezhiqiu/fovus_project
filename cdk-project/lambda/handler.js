const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { nanoid } = require('nanoid');

const s3Client = new S3Client();
const ddbClient = new DynamoDBClient();

exports.handler = async (event) => {
  try {

    console.log("Received event:", JSON.stringify(event));

    const id = event.pathParameters?.id || nanoid();
    const { text, file } = JSON.parse(event.body || '{}');

    // S3 Upload
    const filename = file.name.includes('.') ? file.name : `${file.name}.txt`;
    const s3Params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${id}-${filename}`,
      Body: Buffer.from(file.content, 'base64'),
      ContentType: file.type || 'text/plain',
    };

    await s3Client.send(new PutObjectCommand(s3Params));

    // DynamoDB Insert
    const ddbParams = {
      TableName: process.env.TABLE_NAME,
      Item: {
        id: { S: id },
        text: { S: text },
        filePath: { S: `s3://${process.env.BUCKET_NAME}/${s3Params.Key}` }
      }
    };
    await ddbClient.send(new PutItemCommand(ddbParams));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: 'Success', id })
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: "Error processing request", error: error.toString() })
    };
  }
};
