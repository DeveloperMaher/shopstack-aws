require('dotenv').config(); // Only loaded locally; harmless in EB where no .env exists.

const config = {
  appEnv: process.env.NODE_ENV || 'local',
  region: process.env.AWS_REGION || 'eu-central-1',

  // These will be populated by Elastic Beanstalk from SSM Parameter Store
  // in Step 10. Locally, they come from a .env file (which is gitignored).
  productsTable: process.env.PRODUCTS_TABLE || 'shopstack-products',
  ordersTable: process.env.ORDERS_TABLE || 'shopstack-orders',
  bucketName: process.env.BUCKET_NAME || 'shopstack-images-maher',
  orderTopicArn: process.env.ORDER_TOPIC_ARN || 'arn:aws:sns:eu-central-1:317265268772:shopstack-order-confirmations',
};

module.exports = config;