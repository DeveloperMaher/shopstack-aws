const express = require('express');
const router = express.Router();
const { docClient } = require('../services/dynamodb');
const { TransactWriteCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { publishOrderConfirmation } = require('../services/sns');
const config = require('../config');
const crypto = require('crypto');

// POST /api/orders - Place an order
router.post('/', async (req, res) => {
  try {
    const { productId, quantity, customerEmail } = req.body;
    const orderId = crypto.randomUUID();

    // We use a DynamoDB Transaction to ensure we don't sell out of stock!
    // 1. Create the order
    // 2. Decrement the product's stock (condition: stock must be >= quantity)
    
    // Note: For this to work, the product must have a 'stock' attribute.
    const transactCommand = new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: config.ordersTable,
            Item: {
              id: orderId,
              productId,
              quantity,
              customerEmail,
              status: 'CONFIRMED',
              createdAt: new Date().toISOString()
            }
          }
        },
        {
          Update: {
            TableName: config.productsTable,
            Key: { id: productId },
            UpdateExpression: "SET stock = stock - :qty",
            ConditionExpression: "stock >= :qty",
            ExpressionAttributeValues: {
              ":qty": quantity
            }
          }
        }
      ]
    });

    await docClient.send(transactCommand);

    // If transaction succeeds, publish SNS email (async)
    // We don't await this so the API responds faster to the user
    publishOrderConfirmation(orderId, customerEmail, quantity * 100).catch(console.error);

    res.status(201).json({ message: 'Order placed successfully', orderId });

  } catch (error) {
    console.error(error);
    if (error.name === 'TransactionCanceledException') {
      return res.status(400).json({ error: 'Out of stock or product does not exist' });
    }
    res.status(500).json({ error: 'Failed to place order' });
  }
});

module.exports = router;