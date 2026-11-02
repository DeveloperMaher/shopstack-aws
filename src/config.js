require('dotenv').config();

const config = {
  appEnv: process.env.NODE_ENV || 'local',
  region: process.env.AWS_REGION || 'eu-central-1',
  productsTable: process.env.PRODUCTS_TABLE || 'shopstack-products',
  ordersTable: process.env.ORDERS_TABLE || 'shopstack-orders',
  bucketName: process.env.BUCKET_NAME || 'shopstack-images-maher',
  orderTopicArn: process.env.ORDER_TOPIC_ARN || 'arn:aws:sns:eu-central-1:317265268772:shopstack-order-confirmations',
};

module.exports = config;