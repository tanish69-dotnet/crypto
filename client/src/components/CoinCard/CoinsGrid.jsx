import { useMemo } from 'react';
import { useMarkets } from '../../hooks/useMarkets';
import useCryptoStore from '../../store/useCryptoStore';
import CoinCard from './CoinCard';
import SkeletonGrid from '../Skeleton/SkeletonGrid';

export default function CoinsGrid() {
  const { data: coins, isLoading, isError, refetch } = useMarkets();
  const { searchQuery, sortBy, sortDir, viewMode } = useCryptoStore();

  const filtered = useMemo(() => {
    if (!coins) return [];
    let list = [...coins];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      const av = a[sortBy] ?? 0;
      const bv = b[sortBy] ?? 0;
      return sortDir === 'asc' ? av - bv : bv - av;
    });

    return list;
  }, [coins, searchQuery, sortBy, sortDir]);

  const maxCap = useMemo(
    () => (coins ? Math.max(...coins.map((c) => c.market_cap ?? 0)) : 1),
    [coins]
  );

  if (isLoading) return <SkeletonGrid />;

  if (isError)
    return (
      <div className="error-state">
        <div style={{ fontSize: '3.5rem' }}>⚠️</div>
        <h3>Could not load data</h3>
        <p>CoinGecko API may be rate-limiting. Try again in a moment.</p>
        <button className="retry-btn" onClick={refetch}>Retry Now</button>
      </div>
    );

  if (filtered.length === 0)
    return (
      <div className="error-state">
        <div style={{ fontSize: '3.5rem' }}>🔍</div>
        <h3>No coins found</h3>
        <p>Try a different search term.</p>
      </div>
    );

  return (
    <div className={`coins-grid ${viewMode === 'list' ? 'list' : ''}`}>
      {filtered.map((coin, i) => (
        <CoinCard key={coin.id} coin={coin} index={i} maxMarketCap={maxCap} />
      ))}
    </div>
  );
}
