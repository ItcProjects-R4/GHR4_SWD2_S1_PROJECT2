import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ALL_LEAGUES } from '../constants/leagues';
import { useFavorites } from '../context/FavoritesContext';



export default function LeaguesListPage() {
  const [search, setSearch] = useState('');

  const filtered = ALL_LEAGUES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.country.toLowerCase().includes(search.toLowerCase())
  );

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const toggleFav = (e, league) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite('league', league.id)) {
      removeFavorite('league', league.id);
    } else {
      addFavorite('league', league);
    }
  };

  return (
    <div className="page-wrapper">
      <section
        style={{
          padding: '70px 24px 50px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(0,230,118,0.06) 0%, transparent 100%)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: 12 }}>
            <i className="bi bi-trophy-fill" style={{ color: 'var(--accent-green)', marginRight: 12 }}></i>
            All Leagues
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 500, margin: '0 auto 28px' }}>
            Explore football leagues and competitions from around the world.
            View standings, top scorers, and upcoming fixtures.
          </p>

          <div
            style={{
              position: 'relative',
              maxWidth: 460,
              margin: '0 auto',
            }}
          >
            <i
              className="bi bi-search"
              style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', fontSize: '0.9rem',
              }}
            ></i>
            <input
              type="text"
              placeholder="Search leagues or countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 44px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent-green)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>
        </div>
      </section>




      <section style={{ padding: '0 24px 60px', maxWidth: 1200, margin: '0 auto' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <i className="bi bi-search" style={{ fontSize: '2.5rem', color: 'var(--text-muted)', marginBottom: 12, display: 'block' }}></i>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              No leagues found matching "<strong>{search}</strong>"
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 16,
            }}
          >
            {filtered.map((league) => (
                <Link
                  key={league.id}
                  to={`/league/${league.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    className="fs-card position-relative"
                    style={{
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      cursor: 'pointer',
                    }}
                  >
                    <button
                      onClick={(e) => toggleFav(e, league)}
                      style={{
                        position: 'absolute', top: 8, right: 8,
                        background: 'none', border: 'none', cursor: 'pointer', padding: 4, zIndex: 2
                      }}
                    >
                      <i 
                        className={`bi ${isFavorite('league', league.id) ? 'bi-heart-fill' : 'bi-heart'}`}
                        style={{ 
                          color: isFavorite('league', league.id) ? 'var(--loss)' : 'var(--text-muted)',
                          fontSize: '1rem', transition: 'color 0.2s'
                        }}
                      ></i>
                    </button>

                    <div
                      style={{
                        width: 56, height: 56,
                        borderRadius: '50%',
                        background: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      }}
                    >
                      <img
                        src={league.logo}
                        alt={league.name}
                        style={{ width: 36, height: 36, objectFit: 'contain' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        style={{
                          fontSize: '0.95rem', fontWeight: 600,
                          marginBottom: 4, whiteSpace: 'nowrap',
                          overflow: 'hidden', textOverflow: 'ellipsis',
                        }}
                      >
                        {league.name}
                      </h3>
                      <div className="d-flex align-items-center gap-2">
                        {league.flag && (
                          <img
                            src={league.flag}
                            alt=""
                            style={{ width: 14, height: 14, borderRadius: '50%' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                          {league.country}
                        </span>
                      </div>
                    </div>

                    <i
                      className="bi bi-chevron-right"
                      style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}
                    ></i>
                  </div>
                </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
