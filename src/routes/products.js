const express = require('express');
const router = express.Router();
const { docClient } = require('../services/dynamodb');
const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { generateUploadUrl } = require('../services/s3');
const config = require('../config');
const crypto = require('crypto');

// GET /api/products - List all products
router.get('/', async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({ TableName: config.productsTable }));
    res.json(result.Items || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/products - Create a new product
router.post('/', async (req, res) => {
  try {
    const { name, price, description, stock } = req.body; 
    const product = {
      id: crypto.randomUUID(),
      name,
      price,
      description,
      stock: stock || 0, 
      imageKey: null 
    };

    await docClient.send(new PutCommand({
      TableName: config.productsTable,
      Item: product
    }));

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// POST /api/products/:id/image - Get a Presigned URL to upload image
router.post('/:id/image', async (req, res) => {
  try {
    const { fileType } = req.body; // e.g., 'image/jpeg'
    const key = `products/${req.params.id}-${Date.now()}`;
    
    // Get the secure, temporary upload URL from S3
    const uploadUrl = await generateUploadUrl(key, fileType);
    
    res.json({ uploadUrl, key });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

module.exports = router;