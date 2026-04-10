const express = require('express');
const axios = require('axios');
const cache = require('../cache');

const router = express.Router();
const BASE = 'https://api.coingecko.com/api/v3';

router.get('/', async (req, res) => {
  const key = 'global';
  const cached = cache.get(key);
  if (cached) return res.json(cached);

  try {
    const { data } = await axios.get(`${BASE}/global`, {
      timeout: 8000,
      headers: { 'Accept': 'application/json' },
    });
    const d = data.data;
    const result = {
      totalMarketCap: d.total_market_cap,
      totalVolume: d.total_volume,
      btcDominance: d.market_cap_percentage?.btc,
      ethDominance: d.market_cap_percentage?.eth,
      activeCurrencies: d.active_cryptocurrencies,
      marketCapChange24h: d.market_cap_change_percentage_24h_usd,
    };
    cache.set(key, result, 60);
    res.json(result);
  } catch (err) {
    console.error('[ERR] global:', err.message);
    res.status(err.response?.status || 500).json({ error: 'Failed to fetch global data' });
  }
});

module.exports = router;
