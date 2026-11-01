require('dotenv').config(); // Only loaded locally; harmless in EB where no .env exists.

const config = {
  appEnv: process.env.NODE_ENV || 'local',
  region: process.env.AWS_REGION || 'us-east-1',

  // These will be populated by Elastic Beanstalk from SSM Parameter Store
  // in Step 10. Locally, they come from a .env file (which is gitignored).
  productsTable: process.env.PRODUCTS_TABLE,
  ordersTable: process.env.ORDERS_TABLE,
  bucketName: process.env.BUCKET_NAME,
  orderTopicArn: process.env.ORDER_TOPIC_ARN,
};

module.exports = config;