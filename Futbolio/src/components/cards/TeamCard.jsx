import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';

/**
 * TeamCard
 * Props:
 *  team       — { id, name, logo, country, ... }
 *  showRemove — if true, renders a remove-from-favorites button
 */
export default function TeamCard({ team, showRemove = false }) {
  const { removeFavorite } = useFavorites();

  return (
    <div
      className="fs-card position-relative"
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}
    >
      {showRemove && (
        <button
          onClick={() => removeFavorite('team', team.id)}
          title="Remove from favorites"
          style={{
            position: 'absolute', top: 8, right: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 4, lineHeight: 1,
          }}
        >
          <i
            className="bi bi-x-circle-fill"
            style={{ color: 'var(--text-muted)', fontSize: '0.85rem', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--loss)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
          />
        </button>
      )}

      <Link
        to={`/team/${team.id}`}
        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}
      >
        {/* Logo circle */}
        <div
          style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(255,255,255,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          }}
        >
          {team.logo ? (
            <img
              src={team.logo}
              alt={team.name}
              style={{ width: 34, height: 34, objectFit: 'contain' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <i className="bi bi-shield-fill" style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }} />
          )}
        </div>

        {/* Info */}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 600, fontSize: '0.9rem',
              color: 'var(--text-primary)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}
          >
            {team.name}
          </div>
          {team.country && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
              <i className="bi bi-geo-alt-fill" style={{ marginRight: 4, color: 'var(--text-muted)' }} />
              {team.country}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
