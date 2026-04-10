import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Filler, Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import useCryptoStore from '../../store/useCryptoStore';
import { fmtPrice, fmtChange, fmtLarge } from '../../utils/formatters';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

export default function CoinModal() {
  const { selectedCoin: coin, clearSelectedCoin, currency } = useCryptoStore();

  // Fetch 7-day history
  const { data: history, isLoading: histLoading } = useQuery({
    queryKey: ['history', coin?.id, currency],
    queryFn: async () => {
      const { data } = await axios.get(`/api/history/${coin.id}`, { params: { currency, days: 7 } });
      return data;
    },
    enabled: !!coin,
    staleTime: 5 * 60 * 1000,
  });

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') clearSelectedCoin(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!coin) return null;

  const up = (coin.price_change_percentage_24h ?? 0) >= 0;
  const color = up ? '#10b981' : '#ef4444';

  const labels = history?.prices?.map(([ts]) =>
    new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  ) ?? [];
  const prices = history?.prices?.map(([, p]) => p) ?? [];

  const chartData = {
    labels,
    datasets: [{
      data: prices,
      borderColor: color,
      backgroundColor: (ctx) => {
        const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 180);
        g.addColorStop(0, up ? 'rgba(16,185,129,0.28)' : 'rgba(239,68,68,0.28)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        return g;
      },
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: color,
    }],
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${fmtPrice(ctx.raw, currency)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#8b8fa8', maxTicksLimit: 7, font: { size: 11 } },
        border: { display: false },
      },
      y: {
        position: 'right',
        grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
        ticks: { color: '#8b8fa8', font: { size: 11 }, callback: (v) => fmtPrice(v, currency) },
        border: { display: false },
      },
    },
    interaction: { mode: 'index', intersect: false },
  };

  const stats = [
    { label: 'Market Cap',   val: fmtLarge(coin.market_cap, currency) },
    { label: '24h Volume',   val: fmtLarge(coin.total_volume, currency) },
    { label: 'Circulating',  val: coin.circulating_supply ? `${(coin.circulating_supply / 1e6).toFixed(2)}M ${coin.symbol.toUpperCase()}` : '—' },
    { label: 'All-Time High', val: fmtPrice(coin.ath, currency) },
    { label: 'ATH Change',   val: fmtChange(coin.ath_change_percentage) },
    { label: 'Rank',         val: `#${coin.market_cap_rank}` },
  ];

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={clearSelectedCoin}
    >
      <motion.div
        className="modal glass"
        initial={{ scale: 0.88, y: 32, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.88, y: 32, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={clearSelectedCoin}>✕</button>

        {/* Header */}
        <div className="modal-header">
          <img className="modal-logo" src={coin.image} alt={coin.name} width={52} height={52} />
          <div>
            <div className="modal-name">{coin.name}</div>
            <div className="modal-sym">{coin.symbol} · #{coin.market_cap_rank}</div>
          </div>
          <div className="modal-price-wrap">
            <div className="modal-price">{fmtPrice(coin.current_price, currency)}</div>
            <div className={`modal-chg ${up ? 'c-up' : 'c-dn'}`}>
              {up ? '▲' : '▼'} {fmtChange(coin.price_change_percentage_24h)} (24h)
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="chart-wrap">
          {histLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--txt3)', fontSize: '.85rem' }}>
              Loading chart…
            </div>
          ) : prices.length > 0 ? (
            <Line data={chartData} options={chartOpts} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--txt3)', fontSize: '.85rem' }}>
              Chart data unavailable
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="modal-stats">
          {stats.map(({ label, val }) => (
            <div key={label} className="modal-stat">
              <div className="ms-label">{label}</div>
              <div className="ms-val">{val}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
