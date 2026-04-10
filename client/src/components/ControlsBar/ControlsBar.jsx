import { useState, useEffect } from 'react';
import useCryptoStore from '../../store/useCryptoStore';
import { fmtTime } from '../../utils/formatters';
import { useMarkets } from '../../hooks/useMarkets';

const SORTS = [
  { label: 'Market Cap', field: 'market_cap_rank' },
  { label: 'Price',      field: 'current_price' },
  { label: '24h Change', field: 'price_change_percentage_24h' },
  { label: 'Volume',     field: 'total_volume' },
];

export default function ControlsBar() {
  const { sortBy, setSortBy, viewMode, setViewMode } = useCryptoStore();
  const { dataUpdatedAt } = useMarkets();
  const [updatedAt, setUpdatedAt] = useState('—');

  useEffect(() => {
    if (dataUpdatedAt) setUpdatedAt(fmtTime());
  }, [dataUpdatedAt]);

  return (
    <div className="controls-bar">
      <div className="sort-btns">
        {SORTS.map(({ label, field }) => (
          <button
            key={field}
            className={`sort-btn ${sortBy === field ? 'active' : ''}`}
            onClick={() => setSortBy(field)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="view-toggle">
        <button
          className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
          onClick={() => setViewMode('grid')}
          title="Grid view"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="1.5"/>
            <rect x="14" y="3" width="7" height="7" rx="1.5"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5"/>
            <rect x="14" y="14" width="7" height="7" rx="1.5"/>
          </svg>
        </button>
        <button
          className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
          title="List view"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="4" width="18" height="2.5" rx="1.25"/>
            <rect x="3" y="10.75" width="18" height="2.5" rx="1.25"/>
            <rect x="3" y="17.5" width="18" height="2.5" rx="1.25"/>
          </svg>
        </button>
      </div>

      <div className="updated">
        <span className="pulse-dot" />
        Updated: {updatedAt}
      </div>
    </div>
  );
}
