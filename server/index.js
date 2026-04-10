const express = require('express');
const cors = require('cors');
const marketsRouter = require('./routes/markets');
const globalRouter = require('./routes/global');
const historyRouter = require('./routes/history');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/markets', marketsRouter);
app.use('/api/global', globalRouter);
app.use('/api/history', historyRouter);

app.get('/', (req, res) => res.redirect('http://localhost:5173'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\x1b[36m🚀 CryptoNova API → http://localhost:${PORT}\x1b[0m`);
  });
}

module.exports = app;
