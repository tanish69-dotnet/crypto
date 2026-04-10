export default function SparkLine({ prices, positive, width = 90, height = 36 }) {
  if (!prices || prices.length < 2) return null;
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const range = max - min || 1;
  const pts = prices
    .filter((_, i) => i % Math.ceil(prices.length / 40) === 0)
    .map((p, i, arr) => {
      const x = (i / (arr.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 2) - 1;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const color = positive ? '#10b981' : '#ef4444';
  const id = `sg-${positive ? 'up' : 'dn'}-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
