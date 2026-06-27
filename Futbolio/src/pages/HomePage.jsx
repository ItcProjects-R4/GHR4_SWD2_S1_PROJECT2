import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FootballApiService from '../services/footballApiService';
import { LEAGUES } from '../constants/leagues';
import { useFavorites } from '../context/FavoritesContext';
import { SkeletonCard } from '../components/Loader';

const DEMO_MATCHES = [
  {
    fixture: { id: 1001, date: '2026-06-06T19:00:00+00:00', status: { short: 'FT', elapsed: 90 } },
    league: { id: 39, name: 'Premier League', logo: '/logos/league_39.png' },
    teams: { home: { id: 40, name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png' }, away: { id: 33, name: 'Manchester United', logo: 'https://media.api-sports.io/football/teams/33.png' } },
    goals: { home: 3, away: 1 },
  },
  {
    fixture: { id: 1002, date: '2026-06-06T20:00:00+00:00', status: { short: '2H', elapsed: 72 } },
    league: { id: 140, name: 'La Liga', logo: '/logos/league_140.png' },
    teams: { home: { id: 529, name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png' }, away: { id: 541, name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png' } },
    goals: { home: 2, away: 2 },
  },
  {
    fixture: { id: 1003, date: '2026-06-06T17:30:00+00:00', status: { short: 'FT', elapsed: 90 } },
    league: { id: 233, name: 'Egyptian Premier League', logo: '/logos/league_233.png' },
    teams: { home: { id: 1031, name: 'Al Ahly', logo: 'https://media.api-sports.io/football/teams/1029.png' }, away: { id: 1032, name: 'Zamalek', logo: 'https://media.api-sports.io/football/teams/1040.png' } },
    goals: { home: 2, away: 0 },
  },
  {
    fixture: { id: 1004, date: '2026-06-06T21:00:00+00:00', status: { short: 'NS', elapsed: null } },
    league: { id: 2, name: 'Champions League', logo: '/logos/league_2.png' },
    teams: { home: { id: 50, name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png' }, away: { id: 157, name: 'Bayern Munich', logo: 'https://media.api-sports.io/football/teams/157.png' } },
    goals: { home: null, away: null },
  },
  {
    fixture: { id: 1005, date: '2026-06-06T18:00:00+00:00', status: { short: 'FT', elapsed: 90 } },
    league: { id: 135, name: 'Serie A', logo: '/logos/league_135.png' },
    teams: { home: { id: 489, name: 'AC Milan', logo: 'https://media.api-sports.io/football/teams/489.png' }, away: { id: 505, name: 'Inter', logo: 'https://media.api-sports.io/football/teams/505.png' } },
    goals: { home: 1, away: 3 },
  },
];

/* ── Match Card ── */
function MatchCard({ match }) {
  const navigate  = useNavigate();
  const fixture   = match?.fixture;
  const league    = match?.league;
  const teams     = match?.teams;
  const goals     = match?.goals;
  const status    = fixture?.status;
  const isLive    = ['1H','2H','HT','ET','P'].includes(status?.short);
  const isFinished = status?.short === 'FT';

  const timeLabel = isLive
    ? `${status?.elapsed}'`
    : isFinished ? 'FT'
    : fixture?.date ? new Date(fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  return (
    <div
      className="fs-card"
      onClick={() => navigate(`/match/${fixture?.id}`)}
      style={{ padding: '12px 14px', minWidth: 220, maxWidth: 240, flexShrink: 0, cursor: 'pointer' }}
    >
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center gap-1">
          <img src={league?.logo} alt="" style={{ width: 14, height: 14, objectFit: 'contain' }} onError={(e) => e.target.style.display='none'} />
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {league?.name}
          </span>
        </div>
        {isLive ? (
          <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.6rem', color: 'var(--accent-green)', fontWeight: 700 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-green)', display: 'inline-block', animation: 'pulse-live 1.5s infinite' }}></span>
            LIVE {status?.elapsed}'
          </span>
        ) : (
          <span style={{ fontSize: '0.65rem', color: isFinished ? 'var(--text-secondary)' : 'var(--accent-blue)', fontWeight: 500 }}>{timeLabel}</span>
        )}
      </div>

      <div className="d-flex align-items-center justify-content-between mb-1">
        <div 
          className="d-flex align-items-center gap-2"
          onClick={(e) => { e.stopPropagation(); if (teams?.home?.id) navigate(`/team/${teams.home.id}`); }}
          style={{ cursor: 'pointer' }}
          title={`View ${teams?.home?.name} Profile`}
        >
          <img src={teams?.home?.logo} alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} onError={(e) => e.target.style.display='none'} />
          <span style={{ fontSize: '0.82rem', fontWeight: teams?.home?.winner ? 700 : 500, transition: 'color 0.2s' }} 
                onMouseEnter={(e) => e.target.style.color = 'var(--accent-green)'}
                onMouseLeave={(e) => e.target.style.color = 'inherit'}
          >
            {teams?.home?.name}
          </span>
        </div>
        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: goals?.home > goals?.away ? 'var(--accent-green)' : 'var(--text-primary)' }}>
          {goals?.home ?? '-'}
        </span>
      </div>

      <div className="d-flex align-items-center justify-content-between">
        <div 
          className="d-flex align-items-center gap-2"
          onClick={(e) => { e.stopPropagation(); if (teams?.away?.id) navigate(`/team/${teams.away.id}`); }}
          style={{ cursor: 'pointer' }}
          title={`View ${teams?.away?.name} Profile`}
        >
          <img src={teams?.away?.logo} alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} onError={(e) => e.target.style.display='none'} />
          <span style={{ fontSize: '0.82rem', fontWeight: teams?.away?.winner ? 700 : 500, transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--accent-green)'}
                onMouseLeave={(e) => e.target.style.color = 'inherit'}
          >
            {teams?.away?.name}
          </span>
        </div>
        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: goals?.away > goals?.home ? 'var(--accent-green)' : 'var(--text-primary)' }}>
          {goals?.away ?? '-'}
        </span>
      </div>
    </div>
  );
}

function LeagueCard({ league }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite('league', league.id);

  return (
    <Link to={`/league/${league.id}`} style={{ textDecoration: 'none' }}>
      <div className="fs-card text-center p-3 h-100 position-relative">
        <button
          onClick={(e) => { e.preventDefault(); toggleFavorite('league', { id: league.id, name: league.name, logo: league.logo }); }}
          style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <i className={`bi ${fav ? 'bi-heart-fill' : 'bi-heart'}`} style={{ color: fav ? 'var(--loss)' : 'var(--text-muted)', fontSize: '0.75rem' }}></i>
        </button>

        <div
          className="d-flex align-items-center justify-content-center mx-auto mb-3"
          style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}
        >
          <img src={league.logo} alt={league.name} style={{ width: 48, height: 48, objectFit: 'contain' }} onError={(e) => e.target.style.display='none'} />
        </div>

        <div style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.3, color: 'var(--text-primary)' }}>{league.name}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>{league.country}</div>
      </div>
    </Link>
  );
}


export default function HomePage() {
  const [matches, setMatches]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    FootballApiService.getTodayFixtures()
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        const sortedMatches = arr.sort((a, b) => {
          const aWc = a.league.id === 1 || a.league.id === 200 ? 1 : 0;
          const bWc = b.league.id === 1 || b.league.id === 200 ? 1 : 0;
          if (aWc !== bWc) return bWc - aWc;

          const aLive = ['1H','2H','HT','ET','P'].includes(a.fixture.status.short) ? 1 : 0;
          const bLive = ['1H','2H','HT','ET','P'].includes(b.fixture.status.short) ? 1 : 0;
          if (aLive !== bLive) return bLive - aLive;
          const aPop = LEAGUES.some(l => l.id === a.league.id) ? 1 : 0;
          const bPop = LEAGUES.some(l => l.id === b.league.id) ? 1 : 0;
          return bPop - aPop;
        });
        setMatches(sortedMatches);
      })
      .catch((err) => {
        console.warn('API failed, using demo matches as fallback.');
        setMatches(DEMO_MATCHES);
      })
      .finally(() => setLoading(false));
  }, []);

  const finalMatches = matches.length > 0 ? matches : DEMO_MATCHES;
  const displayMatches = finalMatches.slice(0, 6);

  return (
    <div className="page-wrapper">

      {/* ══════ HERO ══════ */}
      <section style={{ 
        position: 'relative', overflow: 'hidden', padding: '80px 24px 100px',
        backgroundImage: 'linear-gradient(to right, rgba(10, 15, 22, 1) 0%, rgba(10, 15, 22, 0.5) 50%, rgba(10, 15, 22, 0.9) 100%), url("/stadium_hero_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        backgroundRepeat: 'no-repeat',
        borderBottom: '1px solid rgba(0, 230, 118, 0.15)'
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(0,230,118,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,118,0.02) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.6rem)', fontWeight: 800, lineHeight: 1.12, marginBottom: 20 }}>
            <span style={{ color: 'var(--accent-green)' }}>Your Ultimate</span><br />
            Football Companion
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 440, lineHeight: 1.7, marginBottom: 28 }}>
            Professional-grade analytics and live updates. From the intensity of the
            Egyptian Premier League to the grand stage of Europe.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <button className="btn-accent" onClick={() => document.getElementById('leagues')?.scrollIntoView({ behavior: 'smooth' })}>
              <i className="bi bi-trophy-fill me-2"></i>Explore Leagues
            </button>
            <button className="btn-outline" onClick={() => document.getElementById('matches')?.scrollIntoView({ behavior: 'smooth' })}>
              Today's Matches
            </button>
          </div>
        </div>
      </section>

      <section id="matches" style={{ padding: '0 24px 48px', maxWidth: 1248, margin: '0 auto' }}>
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-calendar3" style={{ color: 'var(--accent-green)' }}></i>
            <span style={{ fontWeight: 700 }}>Top Matches Today</span>
          </div>
          <Link to="/matches" style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 500, textDecoration: 'none' }}>
            View All Matches <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        {loading ? (
          <div className="d-flex gap-3" style={{ overflowX: 'auto' }}>
            {[1,2,3,4,5,6].map((i) => <div key={i} style={{ minWidth: 220, flexShrink: 0 }}><SkeletonCard height={100} /></div>)}
          </div>
        ) : error ? (
          <div className="d-flex align-items-center gap-2 p-3 rounded-3" style={{ background: 'rgba(248,81,73,0.07)', border: '1px solid rgba(248,81,73,0.25)', color: 'var(--loss)', fontSize: '0.875rem' }}>
            <i className="bi bi-exclamation-triangle-fill"></i>{error}
          </div>
        ) : displayMatches.length === 0 ? (
          <div className="text-center py-5 rounded-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            <i className="bi bi-calendar-x d-block mb-2" style={{ fontSize: '2rem' }}></i>
            No matches scheduled for today
          </div>
        ) : (
          <div className="d-flex gap-3 pb-2" style={{ overflowX: 'auto' }}>
            {displayMatches.map((m) => <MatchCard key={m?.fixture?.id} match={m} />)}
            {matches.length > 6 && (
              <div className="d-flex align-items-center justify-content-center" style={{ minWidth: 140, flexShrink: 0 }}>
                <Link to="/matches" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--accent-blue)' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(88,166,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-arrow-right" style={{ fontSize: '1.2rem' }}></i>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>View All {matches.length}</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </section>

      <section id="leagues" style={{ padding: '0 24px 48px', maxWidth: 1248, margin: '0 auto' }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-trophy-fill" style={{ color: 'var(--accent-green)' }}></i>
            <span style={{ fontWeight: 700 }}>Popular Leagues</span>
          </div>
          <Link to="/leagues" style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 500, textDecoration: 'none' }}>
            All Leagues <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
        <div className="row g-3">
          {LEAGUES.map((l) => (
            <div key={l.id} className="col-6 col-sm-4 col-md-3">
              <LeagueCard league={l} />
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '0 24px 32px', maxWidth: 1248, margin: '0 auto' }}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <i className="bi bi-lightning-fill" style={{ color: 'var(--accent-green)' }}></i>
          <span style={{ fontWeight: 700 }}>Quick Actions</span>
        </div>
        <div className="row g-3">
          {[
            { to: '/compare',   icon: 'bi-bar-chart-fill', label: 'Compare Teams',  desc: 'Side-by-side team & player stats', color: '#58a6ff' },
            { to: '/search',    icon: 'bi-search',         label: 'Find a Player',  desc: 'Search across all leagues',        color: '#bc8cff' },
            { to: '/favorites', icon: 'bi-heart-fill',     label: 'My Favorites',   desc: 'Your saved teams & leagues',       color: '#f85149' },
          ].map((item) => (
            <div key={item.to} className="col-12 col-md-4">
              <Link to={item.to} style={{ textDecoration: 'none' }}>
                <div className="fs-card p-3 d-flex align-items-center gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: `${item.color}14`, border: `1px solid ${item.color}28` }}
                  >
                    <i className={`bi ${item.icon}`} style={{ color: item.color, fontSize: '1.2rem' }}></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
                  </div>
                  <i className="bi bi-arrow-right ms-auto" style={{ color: 'var(--text-muted)' }}></i>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
