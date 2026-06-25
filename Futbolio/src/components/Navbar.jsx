import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  const links = [
    { to: '/',          label: 'Home',      icon: 'bi-house-fill',     end: true },
    { to: '/matches',   label: 'Matches',   icon: 'bi-calendar3',      end: false },
    { to: '/leagues',   label: 'Leagues',   icon: 'bi-trophy-fill',    end: false },
    { to: '/compare',   label: 'Compare',   icon: 'bi-bar-chart-fill', end: false },
    { to: '/favorites', label: 'Favorites', icon: 'bi-heart-fill',     end: false },
  ];

  return (
    <>
      <nav
        className="d-flex align-items-center justify-content-between px-3 px-md-4"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1040,
          height: 56,
          background: 'rgba(1,4,9,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="d-flex align-items-center gap-2" style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.1em', color: 'var(--accent-green)', textTransform: 'uppercase' }}>
            <img src="/logo.png" alt="Futbolio" style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: '50%' }} />
            Futbolio
          </span>
        </Link>

        <div className="d-none d-md-flex align-items-center gap-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => isActive ? 'nav-link-custom active' : 'nav-link-custom'}
              style={{ display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <i className={`bi ${l.icon}`} style={{ fontSize: '0.8rem' }} />
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="d-flex align-items-center gap-3">
          <button
            onClick={() => navigate('/search')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0 }}
          >
            <i className="bi bi-search" style={{ fontSize: '1rem' }}></i>
          </button>

          <Link to="/favorites" style={{ position: 'relative', color: 'var(--text-secondary)', transition: 'color 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--loss)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <i className="bi bi-heart-fill" style={{ fontSize: '1rem' }}></i>
            {favorites.length > 0 && (
              <span
                className="d-flex align-items-center justify-content-center"
                style={{
                  position: 'absolute', top: -6, right: -8,
                  background: 'var(--accent-green)', color: '#000',
                  fontSize: '0.5rem', fontWeight: 700,
                  borderRadius: '50%', width: 14, height: 14,
                }}
              >
                {favorites.length}
              </span>
            )}
          </Link>

          <button
            className="d-md-none"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '1.3rem' }}
          >
            <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          style={{
            position: 'fixed', top: 56, left: 0, right: 0, zIndex: 1039,
            background: 'rgba(1,4,9,0.98)',
            borderBottom: '1px solid var(--border)',
            padding: '8px 16px 16px',
          }}
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                display: 'block', padding: '10px 0',
                borderBottom: '1px solid var(--border-light)',
                color: isActive ? 'var(--accent-green)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.95rem', textDecoration: 'none',
              })}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}

      <nav
        className="d-md-none d-flex justify-content-around align-items-center"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1040,
          background: 'rgba(1,4,9,0.97)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--border)',
          padding: '6px 0',
        }}
      >
        {[
          { to: '/',          icon: 'bi-house-fill',     label: 'Home',      end: true },
          { to: '/matches',   icon: 'bi-calendar3',      label: 'Matches',   end: false },
          { to: '/leagues',   icon: 'bi-trophy-fill',    label: 'Leagues',   end: false },
          { to: '/compare',   icon: 'bi-bar-chart-fill', label: 'Compare',   end: false },
          { to: '/favorites', icon: 'bi-heart-fill',     label: 'Favorites', end: false },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              color: isActive ? 'var(--accent-green)' : 'var(--text-muted)',
              fontSize: '0.6rem', fontWeight: isActive ? 600 : 400,
              textDecoration: 'none', minWidth: 48,
            })}
          >
            <i className={`bi ${item.icon}`} style={{ fontSize: '1.1rem' }}></i>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
