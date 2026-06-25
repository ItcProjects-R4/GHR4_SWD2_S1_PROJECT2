import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';

/**
 * PlayerCard
 * Props:
 *  player     — { id, name, photo?, position?, nationality? }
 *  showRemove — if true, renders a remove-from-favorites button
 */
export default function PlayerCard({ player, showRemove = false }) {
  const { removeFavorite } = useFavorites();

  return (
    <div
      className="fs-card position-relative"
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}
    >
      {showRemove && (
        <button
          onClick={() => removeFavorite('player', player.id)}
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
        to={`/player/${player.id}`}
        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}
      >
        {/* Avatar circle */}
        <div
          style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'var(--bg-secondary)',
            border: '2px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, overflow: 'hidden',
          }}
        >
          {player.photo ? (
            <img
              src={player.photo}
              alt={player.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling && (e.target.nextSibling.style.display = 'block');
              }}
            />
          ) : null}
          <i
            className="bi bi-person-fill"
            style={{ fontSize: '1.5rem', color: 'var(--text-muted)', display: player.photo ? 'none' : 'block' }}
          />
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
            {player.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {[player.position, player.nationality].filter(Boolean).join(' · ')}
          </div>
        </div>
      </Link>
    </div>
  );
}
