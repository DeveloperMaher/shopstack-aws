const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const config = require("../config");

const snsClient = new SNSClient({ region: config.region });

async function publishOrderConfirmation(orderId, customerEmail, totalAmount) {
  const message = `Thank you for your order!\n\nOrder ID: ${orderId}\nTotal: $${totalAmount}`;
  
  const command = new PublishCommand({
    TopicArn: config.orderTopicArn,
    Subject: "ShopStack Order Confirmation",
    Message: message,
  });

  return await snsClient.send(command);
}

module.exports = { publishOrderConfirmation };