import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMarkets } from '../../hooks/useMarkets';
import { fmtChange } from '../../utils/formatters';
import useCryptoStore from '../../store/useCryptoStore';

function MoverSkeleton() {
  return (
    <div className="movers-list">
      {[1, 2, 3].map((i) => <div key={i} className="sk-mv" style={{ background: 'rgba(255,255,255,0.05)' }} />)}
    </div>
  );
}

export default function Movers() {
  const { data: coins, isLoading } = useMarkets();
  const setSelectedCoin = useCryptoStore((s) => s.setSelectedCoin);

  const [gainers, losers] = useMemo(() => {
    if (!coins) return [[], []];
    const sorted = [...coins]
      .filter((c) => c.price_change_percentage_24h != null)
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    return [sorted.slice(0, 4), sorted.slice(-4).reverse()];
  }, [coins]);

  const MoverList = ({ list, type }) =>
    isLoading ? <MoverSkeleton /> : (
      <div className="movers-list">
        {list.map((c) => {
          const up = c.price_change_percentage_24h >= 0;
          return (
            <motion.div
              key={c.id}
              className="mover"
              whileHover={{ x: 4 }}
              onClick={() => setSelectedCoin(c)}
            >
              <img src={c.image} alt={c.name} width={26} height={26} loading="lazy" />
              <span className="mover-name">{c.name}</span>
              <span className={`mover-chg ${up ? 'u' : 'd'}`}>
                {fmtChange(c.price_change_percentage_24h)}
              </span>
            </motion.div>
          );
        })}
      </div>
    );

  return (
    <motion.div
      className="movers"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="movers-card glass">
        <h3 className="movers-title g">🚀 Top Gainers</h3>
        <MoverList list={gainers} type="gain" />
      </div>
      <div className="movers-card glass">
        <h3 className="movers-title l">📉 Top Losers</h3>
        <MoverList list={losers} type="loss" />
      </div>
    </motion.div>
  );
}
