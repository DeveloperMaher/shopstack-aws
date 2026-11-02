const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const config = require("../config");

const s3Client = new S3Client({ region: config.region });

// Generate a URL that allows a user to upload a file directly to S3
async function generateUploadUrl(key, contentType) {
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    ContentType: contentType,
  });
  
  return await getSignedUrl(s3Client, command, { expiresIn: 300 });
}

module.exports = { generateUploadUrl };