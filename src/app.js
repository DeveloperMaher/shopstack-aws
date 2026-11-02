const express = require('express');
const config = require('./config');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'shopstack', env: config.appEnv });
});


app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(JSON.stringify({ level: 'info', msg: 'ShopStack started', port }));
});