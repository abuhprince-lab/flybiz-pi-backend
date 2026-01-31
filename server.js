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

/* Health check route (optional) */
app.get('/', (req, res) => {
  res.send('Pi backend live');
});

/* APPROVE PAYMENT */
app.post('/api/approve-payment', async (req, res) => {
  const { paymentId } = req.body;

  if (!paymentId) {
    console.warn('No paymentId provided');
    return res.status(400).send('Missing paymentId');
  }

  console.log('APPROVE HIT', paymentId);

  try {
    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: 'POST',
        headers: { Authorization: `Key ${PI_API_KEY}` }
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error('Approval failed:', text);
      return res.status(500).send('Approval failed');
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Error approving payment:', err);
    res.status(500).send('Server error');
  }
});

/* COMPLETE PAYMENT */
app.post('/api/complete-payment', async (req, res) => {
  const { paymentId, txid } = req.body;

  if (!paymentId || !txid) {
    console.warn('Missing paymentId or txid');
    return res.status(400).send('Missing paymentId or txid');
  }

  console.log('COMPLETE HIT', paymentId, txid);

  try {
    const response = await fetch(
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

    if (!response.ok) {
      const text = await response.text();
      console.error('Completion failed:', text);
      return res.status(500).send('Completion failed');
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Error completing payment:', err);
    res.status(500).send('Server error');
  }
});

/* Listen on Render port */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on', PORT));
