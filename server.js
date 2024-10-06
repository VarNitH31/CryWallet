import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/get-sol-price', async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'solana',
        vs_currencies: 'usd',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Solana price:', error); // Add error logging for debugging
    res.status(500).send('Error fetching Solana price');
  }
}); 

app.listen(4000, () => {
  console.log('Proxy server running on port 4000');
});
