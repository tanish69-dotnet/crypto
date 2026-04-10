import { useMemo } from 'react';
import { useMarkets } from '../../hooks/useMarkets';
import { fmtPrice, fmtChange } from '../../utils/formatters';
import useCryptoStore from '../../store/useCryptoStore';

export default function Ticker() {
  const { data: coins } = useMarkets();
  const currency = useCryptoStore((s) => s.currency);

  const items = useMemo(() => {
    if (!coins) return [];
    return coins.slice(0, 20).map((c) => ({
      sym:    c.symbol.toUpperCase(),
      price:  fmtPrice(c.current_price, currency),
      change: fmtChange(c.price_change_percentage_24h),
      up:     (c.price_change_percentage_24h ?? 0) >= 0,
    }));
  }, [coins, currency]);

  if (!items.length) return null;

  const doubled = [...items, ...items];

  return (
    <div className="ticker-bar">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span className="ticker-item" key={i}>
            <span className="t-sym">{item.sym}</span>
            <span className="t-price">{item.price}</span>
            <span className={item.up ? 't-up' : 't-dn'}>{item.change}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
