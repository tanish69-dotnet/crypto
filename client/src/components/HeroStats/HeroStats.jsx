import { motion } from 'framer-motion';
import { useGlobal } from '../../hooks/useGlobal';
import { fmtLarge, fmtChange } from '../../utils/formatters';
import useCryptoStore from '../../store/useCryptoStore';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function HeroStats() {
  const { data: global } = useGlobal();
  const currency = useCryptoStore((s) => s.currency);

  const mktCap  = global?.totalMarketCap?.[currency];
  const volume  = global?.totalVolume?.[currency];
  const btcDom  = global?.btcDominance;
  const chg24h  = global?.marketCapChange24h;

  return (
    <section className="hero">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="hero-badge">
          <span className="live-dot" />
          LIVE MARKET DATA
        </div>
        <h1 className="hero-title">
          Real-Time Crypto<br />
          <span className="grad">Intelligence</span>
        </h1>
        <p className="hero-sub">
          Track the top 50 cryptocurrencies with live prices, market caps, and beautiful analytics.
        </p>
      </motion.div>

      <motion.div
        className="hero-stats"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={item} className="stat-card glass">
          <div className="stat-label">Total Market Cap</div>
          <div className="stat-val">{mktCap ? fmtLarge(mktCap, currency) : '—'}</div>
          {chg24h != null && (
            <div className={`stat-chg ${chg24h >= 0 ? 'c-up' : 'c-dn'}`}>{fmtChange(chg24h)}</div>
          )}
        </motion.div>

        <motion.div variants={item} className="stat-card glass">
          <div className="stat-label">24h Volume</div>
          <div className="stat-val">{volume ? fmtLarge(volume, currency) : '—'}</div>
        </motion.div>

        <motion.div variants={item} className="stat-card glass">
          <div className="stat-label">BTC Dominance</div>
          <div className="stat-val">{btcDom != null ? `${btcDom.toFixed(1)}%` : '—'}</div>
        </motion.div>

        <motion.div variants={item} className="stat-card glass">
          <div className="stat-label">Active Coins</div>
          <div className="stat-val">{global?.activeCurrencies?.toLocaleString() ?? '—'}</div>
        </motion.div>
      </motion.div>
    </section>
  );
}
