import { motion } from 'framer-motion';
import { useMarkets } from '../../hooks/useMarkets';
import useCryptoStore from '../../store/useCryptoStore';
import { fmtPrice, fmtChange } from '../../utils/formatters';

export default function Watchlist() {
  const { watchlist, isWatched, toggleWatchlist, setSelectedCoin, currency } = useCryptoStore();
  const { data: coins } = useMarkets();

  const watched = coins?.filter((c) => watchlist.includes(c.id)) ?? [];

  return (
    <motion.div
      className="wl-panel glass"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h3>⭐ My Watchlist ({watched.length})</h3>
      {watched.length === 0 ? (
        <p className="wl-empty">No coins added yet — click ⭐ on any coin card to add it.</p>
      ) : (
        <div className="wl-grid">
          {watched.map((c) => {
            const up = (c.price_change_percentage_24h ?? 0) >= 0;
            return (
              <div key={c.id} className="wl-mini" onClick={() => setSelectedCoin(c)}>
                <img src={c.image} alt={c.name} width={26} height={26} />
                <div className="wl-mini-info">
                  <div className="wl-mini-name">{c.name}</div>
                  <div className="wl-mini-price">{fmtPrice(c.current_price, currency)}</div>
                </div>
                <span className={`wl-mini-chg ${up ? 'c-up' : 'c-dn'}`}>
                  {fmtChange(c.price_change_percentage_24h)}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWatchlist(c.id); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', marginLeft: 4 }}
                  title="Remove"
                >✕</button>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
