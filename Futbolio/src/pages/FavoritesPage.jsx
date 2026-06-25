import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import TeamCard from '../components/cards/TeamCard';
import PlayerCard from '../components/cards/PlayerCard';


function FavLeagueCard({ league }) {
  const { removeFavorite } = useFavorites();

  return (
    <Link to={`/league/${league.id}`} style={{ textDecoration: 'none' }}>
      <div className="fs-card text-center p-3 h-100 position-relative">

        <button
          onClick={(e) => { e.preventDefault(); removeFavorite('league', league.id); }}
          title="Remove from favorites"
          style={{
            position: 'absolute', top: 8, right: 8,
            background: 'none', border: 'none', cursor: 'pointer', padding: 4, lineHeight: 1,
          }}
        >
          <i
            className="bi bi-heart-fill"
            style={{ color: 'var(--loss)', fontSize: '0.8rem', opacity: 0.7, transition: 'opacity 0.2s' }}
            onMouseEnter={(e) => (e.target.style.opacity = '1')}
            onMouseLeave={(e) => (e.target.style.opacity = '0.7')}
          />
        </button>


        <div
          className="d-flex align-items-center justify-content-center mx-auto mb-3"
          style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}
        >
          <img
            src={league.logo}
            alt={league.name}
            style={{ width: 48, height: 48, objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        <div style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.3, color: 'var(--text-primary)' }}>
          {league.name}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
          {league.country}
        </div>
      </div>
    </Link>
  );
}


function SectionHeading({ icon, title, count }) {
  return (
    <div className="d-flex align-items-center gap-2 mb-3">
      <i className={`bi ${icon}`} style={{ color: 'var(--accent-green)' }} />
      <span style={{ fontWeight: 700, fontSize: '1rem' }}>{title}</span>
      {count > 0 && (
        <span
          style={{
            background: 'rgba(0,230,118,0.1)', color: 'var(--accent-green)',
            fontSize: '0.68rem', fontWeight: 700,
            padding: '2px 8px', borderRadius: 12,
            border: '1px solid rgba(0,230,118,0.25)',
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}


function EmptyState({ type = 'all' }) {
  const CONFIGS = {
    all:    { icon: 'bi-heart',    message: "You haven't saved any favorites yet.",       cta: 'Explore Leagues', to: '/leagues' },
    league: { icon: 'bi-trophy',   message: "No favorite leagues saved yet.",              cta: 'Browse Leagues',  to: '/leagues' },
    team:   { icon: 'bi-shield',   message: "No favorite teams saved yet.",                cta: 'Browse Leagues',  to: '/leagues' },
    player: { icon: 'bi-person',   message: "No favorite players saved yet.",              cta: 'Browse Leagues',  to: '/leagues' },
  };
  const cfg = CONFIGS[type] ?? CONFIGS.all;

  return (
    <div className="text-center" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <div
        style={{
          width: 88, height: 88, borderRadius: '50%',
          background: 'rgba(0,230,118,0.05)',
          border: '1px solid rgba(0,230,118,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}
      >
        <i className={`bi ${cfg.icon}`} style={{ fontSize: '2.2rem', color: 'rgba(0,230,118,0.35)' }} />
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 24 }}>
        {cfg.message}
      </p>
      <Link
        to={cfg.to}
        className="btn-accent"
        style={{ display: 'inline-block', textDecoration: 'none', borderRadius: 8 }}
      >
        <i className="bi bi-compass me-2" />
        {cfg.cta}
      </Link>
    </div>
  );
}
const TABS = [
  { id: 'all',    label: 'All',     icon: 'bi-collection-fill' },
  { id: 'league', label: 'Leagues', icon: 'bi-trophy-fill' },
  { id: 'team',   label: 'Teams',   icon: 'bi-shield-fill' },
  { id: 'player', label: 'Players', icon: 'bi-person-fill' },
];


export default function FavoritesPage() {
  const { getFavorites, favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState('all');

  const leagues = getFavorites('league');
  const teams   = getFavorites('team');
  const players = getFavorites('player');
  const all     = favorites;

  const counts = { all: all.length, league: leagues.length, team: teams.length, player: players.length };

  return (
    <div className="page-wrapper">

      <section
        style={{
          padding: '56px 24px 44px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(248,81,73,0.07) 0%, transparent 100%)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: 680, margin: '0 auto' }}>

          <div
            style={{
              width: 68, height: 68, borderRadius: '50%',
              background: 'rgba(248,81,73,0.1)',
              border: '1px solid rgba(248,81,73,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px',
            }}
          >
            <i className="bi bi-heart-fill" style={{ fontSize: '1.8rem', color: 'var(--loss)' }} />
          </div>

          <h1 style={{ fontSize: 'clamp(1.9rem, 5vw, 2.8rem)', fontWeight: 800, marginBottom: 10 }}>
            My Favorites
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 auto 20px', maxWidth: 480 }}>
            Your saved leagues, teams, and players — all in one place.
          </p>

          {all.length > 0 && (
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '5px 16px',
                background: 'rgba(0,230,118,0.08)',
                border: '1px solid rgba(0,230,118,0.2)',
                borderRadius: 20,
              }}
            >
              <i className="bi bi-collection-fill" style={{ color: 'var(--accent-green)', fontSize: '0.75rem' }} />
              <span style={{ color: 'var(--accent-green)', fontSize: '0.82rem', fontWeight: 600 }}>
                {all.length} item{all.length !== 1 ? 's' : ''} saved
              </span>
            </div>
          )}
        </div>
      </section>

      <div
        style={{
          position: 'sticky', top: 56, zIndex: 20,
          background: 'rgba(13,17,23,0.96)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="d-flex" style={{ overflowX: 'auto', gap: 0 }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: 'none', border: 'none',
                    padding: '13px 20px',
                    color: isActive ? 'var(--accent-green)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    borderBottom: isActive ? '2px solid var(--accent-green)' : '2px solid transparent',
                    transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: 7,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <i className={`bi ${tab.icon}`} style={{ fontSize: '0.85rem' }} />
                  {tab.label}
                  {counts[tab.id] > 0 && (
                    <span
                      style={{
                        fontSize: '0.65rem', fontWeight: 700,
                        padding: '1px 7px', borderRadius: 10,
                        background: isActive ? 'rgba(0,230,118,0.15)' : 'rgba(255,255,255,0.07)',
                        color: isActive ? 'var(--accent-green)' : 'var(--text-muted)',
                      }}
                    >
                      {counts[tab.id]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section style={{ maxWidth: 1200, margin: '36px auto', padding: '0 24px' }}>

        {/* ── ALL ── */}
        {activeTab === 'all' && (
          all.length === 0
            ? <EmptyState type="all" />
            : (
              <div>
                {leagues.length > 0 && (
                  <div className="mb-5">
                    <SectionHeading icon="bi-trophy-fill" title="Leagues" count={leagues.length} />
                    <div className="row g-3">
                      {leagues.map((l) => (
                        <div key={l.id} className="col-6 col-sm-4 col-md-3 col-xl-2">
                          <FavLeagueCard league={l} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {teams.length > 0 && (
                  <div className="mb-5">
                    <SectionHeading icon="bi-shield-fill" title="Teams" count={teams.length} />
                    <div className="row g-3">
                      {teams.map((t) => (
                        <div key={t.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                          <TeamCard team={t} showRemove />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {players.length > 0 && (
                  <div className="mb-5">
                    <SectionHeading icon="bi-person-fill" title="Players" count={players.length} />
                    <div className="row g-3">
                      {players.map((p) => (
                        <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                          <PlayerCard player={p} showRemove />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
        )}

        {activeTab === 'league' && (
          leagues.length === 0
            ? <EmptyState type="league" />
            : (
              <div className="row g-3">
                {leagues.map((l) => (
                  <div key={l.id} className="col-6 col-sm-4 col-md-3 col-xl-2">
                    <FavLeagueCard league={l} />
                  </div>
                ))}
              </div>
            )
        )}

        {activeTab === 'team' && (
          teams.length === 0
            ? <EmptyState type="team" />
            : (
              <div className="row g-3">
                {teams.map((t) => (
                  <div key={t.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <TeamCard team={t} showRemove />
                  </div>
                ))}
              </div>
            )
        )}

        {activeTab === 'player' && (
          players.length === 0
            ? <EmptyState type="player" />
            : (
              <div className="row g-3">
                {players.map((p) => (
                  <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <PlayerCard player={p} showRemove />
                  </div>
                ))}
              </div>
            )
        )}

      </section>
    </div>
  );
}
