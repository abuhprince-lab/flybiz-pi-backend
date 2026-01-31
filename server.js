import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const PI_API_KEY = process.env.PI_API_KEY;

/* PRODUCT SOURCE */
const PRODUCTS = {
  gold_bar_1g: 0.020,
  gold_bar_5g: 0.100,
  gold_bar_10g: 0.200,
  gold_bar_1oz: 0.550
};

app.post('/api/approve-payment', async (req, res) => {
  const { paymentId } = req.body;

  await fetch(
    `https://api.minepi.com/v2/payments/${paymentId}/approve`,
    {
      method: 'POST',
      headers: { Authorization: `Key ${PI_API_KEY}` }
    }
  );

  res.sendStatus(200);
});

app.post('/api/complete-payment', async (req, res) => {
  const { paymentId, txid } = req.body;

  await fetch(
    `https://api.minepi.com/v2/payments/${paymentId}/complete`,
    {
      method: 'POST',
      headers: {
        Authorization: `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ txid })
    }
  );

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server running on', PORT);
});
