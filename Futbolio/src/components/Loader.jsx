export function SkeletonCard({ height = 120 }) {
  return <div className="skeleton" style={{ height, borderRadius: 10, marginBottom: 12 }} />;
}

export function SkeletonRow({ count = 5 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 44, marginBottom: 8, borderRadius: 6 }} />
      ))}
    </>
  );
}

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 200, gap: 16, color: 'var(--text-secondary)' }}>
      <div className="spinner-border" role="status" style={{ color: 'var(--accent-green)', width: 36, height: 36 }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <span style={{ fontSize: '0.9rem' }}>{text}</span>
    </div>
  );
}
