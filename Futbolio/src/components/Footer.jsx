import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'var(--bg-nav)', borderTop: '1px solid var(--border)', paddingBottom: 64 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 20px', textAlign: 'center' }}>
        <div className="d-flex align-items-center justify-content-center gap-2" style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.12em', color: 'var(--accent-green)', textTransform: 'uppercase', marginBottom: 20 }}>
          <img src="/logo.png" alt="Futbolio" style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: '50%' }} />
          Futbolio
        </div>

        {/* Links */}
        <div className="d-flex justify-content-center gap-4 flex-wrap" style={{ marginBottom: 20 }}>
          {[
            { to: '/',          label: 'Home' },
            { to: '/leagues',   label: 'Leagues' },
            { to: '/compare',   label: 'Compare' },
            { to: '/favorites', label: 'Favorites' },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="nav-link-custom"
              style={{ fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            &copy; {year} Futbolio. All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
