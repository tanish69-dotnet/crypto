import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useCryptoStore from '../../store/useCryptoStore';
import { fmtPrice, fmtChange, fmtLarge } from '../../utils/formatters';
import SparkLine from './SparkLine';

export default function CoinCard({ coin, index, maxMarketCap }) {
  const { currency, toggleWatchlist, isWatched, setSelectedCoin } = useCryptoStore();
  const cardRef = useRef(null);
  const prevPrice = useRef(coin.current_price);
  const [flash, setFlash] = useState(null);
  const watched = isWatched(coin.id);

  const up = (coin.price_change_percentage_24h ?? 0) >= 0;
  const capPct = maxMarketCap ? ((coin.market_cap / maxMarketCap) * 100).toFixed(1) : 0;
  const sparkPrices = coin.sparkline_in_7d?.price ?? [];

  // Flash on price update
  useEffect(() => {
    if (prevPrice.current !== coin.current_price) {
      const dir = coin.current_price > prevPrice.current ? 'flash-up' : 'flash-dn';
      setFlash(dir);
      prevPrice.current = coin.current_price;
      const t = setTimeout(() => setFlash(null), 900);
      return () => clearTimeout(t);
    }
  }, [coin.current_price]);

  // 3D tilt
  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / rect.height) * -14;
    const ry = ((x - rect.width  / 2) / rect.width)  *  14;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px) scale(1.01)`;
    el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.45), 0 0 30px rgba(124,58,237,0.2)`;
    el.style.borderColor = 'rgba(124,58,237,0.45)';
  };
  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = '';
    el.style.boxShadow = '';
    el.style.borderColor = '';
  };

  return (
    <motion.div
      ref={cardRef}
      className="coin-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setSelectedCoin(coin)}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.6), ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Top row: rank + watchlist star */}
      <div className="card-top">
        <span className="card-rank">#{coin.market_cap_rank}</span>
        <button
          className={`star-btn ${watched ? 'on' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleWatchlist(coin.id); }}
          title="Add to watchlist"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
      </div>

      {/* Header */}
      <div className="card-header">
        <img className="coin-logo" src={coin.image} alt={coin.name} width={44} height={44} loading="lazy" />
        <div>
          <div className="coin-name" title={coin.name}>{coin.name}</div>
          <div className="coin-sym">{coin.symbol}</div>
        </div>
      </div>

      {/* Price + change */}
      <div>
        <div className="price-row">
          <span className={`coin-price ${flash || ''}`}>
            {fmtPrice(coin.current_price, currency)}
          </span>
          <span className={`chg-badge ${up ? 'u' : 'd'}`}>
            {up ? '▲' : '▼'} {fmtChange(coin.price_change_percentage_24h)}
          </span>
        </div>
        <div className="mktcap">Mkt Cap: {fmtLarge(coin.market_cap, currency)}</div>
      </div>

      {/* Market cap bar */}
      <div className="cap-bar">
        <div className="cap-fill" style={{ width: `${capPct}%` }} />
      </div>

      {/* Footer: volume + sparkline */}
      <div className="card-footer">
        <div className="vol-txt">Vol: {fmtLarge(coin.total_volume, currency)}</div>
        {sparkPrices.length > 0 && <SparkLine prices={sparkPrices} positive={up} />}
      </div>
    </motion.div>
  );
}
