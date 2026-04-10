const express = require('express');
const axios = require('axios');
const cache = require('../cache');

const router = express.Router();
const BASE = 'https://api.coingecko.com/api/v3';

router.get('/', async (req, res) => {
  const { currency = 'usd' } = req.query;
  const key = `markets_${currency}`;
  const cached = cache.get(key);
  if (cached) return res.json(cached);

  try {
    const { data } = await axios.get(`${BASE}/coins/markets`, {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: 50,
        page: 1,
        sparkline: true,
        price_change_percentage: '24h',
      },
      timeout: 12000,
      headers: { 'Accept': 'application/json' },
    });
    cache.set(key, data);
    console.log(`[OK] markets/${currency} → ${data.length} coins`);
    res.json(data);
  } catch (err) {
    console.error('[ERR] markets:', err.message);
    res.status(err.response?.status || 500).json({
      error: 'Failed to fetch markets',
      rateLimited: err.response?.status === 429,
    });
  }
});

module.exports = router;
