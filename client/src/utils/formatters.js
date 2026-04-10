const SYMBOLS = { usd: '$', inr: '₹', eur: '€', btc: '₿', eth: 'Ξ' };

export const sym = (currency) => SYMBOLS[currency] || '$';

export const fmtPrice = (v, currency = 'usd') => {
  if (v == null) return '—';
  const s = sym(currency);
  if (currency === 'btc' || currency === 'eth') return `${s}${v.toFixed(8)}`;
  if (v >= 1e12) return `${s}${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9)  return `${s}${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6)  return `${s}${(v / 1e6).toFixed(2)}M`;
  if (v >= 1000) return `${s}${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (v >= 1)    return `${s}${v.toFixed(2)}`;
  return `${s}${v.toFixed(6)}`;
};

export const fmtChange = (v) => {
  if (v == null) return '—';
  return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;
};

export const fmtLarge = (v, currency = 'usd') => {
  if (!v) return '—';
  const s = sym(currency);
  if (v >= 1e12) return `${s}${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9)  return `${s}${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6)  return `${s}${(v / 1e6).toFixed(2)}M`;
  return `${s}${v.toLocaleString()}`;
};

export const fmtTime = () =>
  new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
