import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const PI_API_KEY = process.env.PI_API_KEY;
if (!PI_API_KEY) {
  console.error('ERROR: PI_API_KEY not set in environment');
  process.exit(1);
}

/* PRODUCT SOURCE */
const PRODUCTS = {
  gold_bar_1g: 0.020,
  gold_bar_5g: 0.100,
  gold_bar_10g: 0.200,
  gold_bar_1oz: 0.550
};

/* Health check route */
app.get('/', (req, res) => {
  res.send('Pi backend live');
});

/* APPROVE PAYMENT */
app.post('/api/approve-payment', (req, res) => {
  const { paymentId } = req.body;
  if (!paymentId) return res.status(400).send('Missing paymentId');

  console.log('APPROVE HIT', paymentId);

  // Respond immediately to Pi to avoid timeout
  res.sendStatus(200);

  // Approve asynchronously
  fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
    method: 'POST',
    headers: { Authorization: `Key ${PI_API_KEY}` }
  })
  .then(r => r.text())
  .then(t => console.log('Pi approve response:', t))
  .catch(err => console.error('Pi approve error:', err));
});

/* COMPLETE PAYMENT */
app.post('/api/complete-payment', (req, res) => {
  const { paymentId, txid } = req.body;
  if (!paymentId || !txid) return res.status(400).send('Missing paymentId or txid');

  console.log('COMPLETE HIT', paymentId, txid);

  // Respond immediately to Pi
  res.sendStatus(200);

  // Complete asynchronously
  fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
    method: 'POST',
    headers: {
      Authorization: `Key ${PI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ txid })
  })
  .then(r => r.text())
  .then(t => console.log('Pi complete response:', t))
  .catch(err => console.error('Pi complete error:', err));
});

/* Listen on Render port */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on', PORT));
