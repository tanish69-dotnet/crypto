const SKELETON_COUNT = 12;

function SkeletonCard() {
  return (
    <div className="sk-card glass">
      <div className="sk-row w60" />
      <div className="sk-row w40" style={{ height: 24, marginBottom: 14 }} />
      <div className="sk-row w30" />
      <div className="sk-row w60" style={{ marginTop: 16, height: 3 }} />
    </div>
  );
}

export default function SkeletonGrid() {
  return (
    <div className="coins-grid">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
