const express = require('express');
const axios = require('axios');
const cache = require('../cache');

const router = express.Router();
const BASE = 'https://api.coingecko.com/api/v3';

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { currency = 'usd', days = 7 } = req.query;
  const key = `history_${id}_${currency}_${days}`;
  const cached = cache.get(key);
  if (cached) return res.json(cached);

  try {
    const { data } = await axios.get(`${BASE}/coins/${id}/market_chart`, {
      params: { vs_currency: currency, days },
      timeout: 10000,
      headers: { 'Accept': 'application/json' },
    });
    cache.set(key, data, 300); // 5 min TTL
    res.json(data);
  } catch (err) {
    console.error(`[ERR] history/${id}:`, err.message);
    res.status(err.response?.status || 500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
