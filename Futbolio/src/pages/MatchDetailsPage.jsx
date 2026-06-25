import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FootballApiService from '../services/footballApiService';

function formatMatchDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
function formatMatchTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function EventsTab({ fixtureId, homeTeamId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    FootballApiService.getFixtureEvents(fixtureId)
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(() => setError('Failed to load match events.'))
      .finally(() => setLoading(false));
  }, [fixtureId]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success" role="status"></div></div>;
  if (error) return <div className="alert alert-danger mx-3 mt-3">{error}</div>;
  if (events.length === 0) return <div className="text-center py-5 text-muted">No events recorded for this match.</div>;

  const getEventIcon = (type, detail) => {
    if (type === 'Goal' && detail === 'Penalty') return '⚽🅿️';
    if (type === 'Goal' && detail === 'Own Goal') return '⚽🔴';
    if (type === 'Goal') return '⚽';
    if (type === 'Card' && detail === 'Yellow Card') return '🟨';
    if (type === 'Card' && detail === 'Second Yellow card') return '🟨🟨';
    if (type === 'Card' && detail === 'Red Card') return '🟥';
    if (type === 'subst') return '🔄';
    if (type === 'Var') return '📺';
    return '📌';
  };

  const getEventLabel = (ev) => {
    if (ev.type === 'subst') {
      return (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--win)', fontSize: '0.85rem' }}>
            <i className="bi bi-arrow-up-short" /> {ev.assist?.name || '—'}
          </div>
          <div style={{ fontWeight: 500, color: 'var(--loss)', fontSize: '0.8rem' }}>
            <i className="bi bi-arrow-down-short" /> {ev.player?.name || '—'}
          </div>
        </div>
      );
    }
    return (
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{ev.player?.name || '—'}</div>
        {ev.assist?.name && ev.type === 'Goal' && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Assist: {ev.assist.name}
          </div>
        )}
        {ev.detail && ev.detail !== 'Normal Goal' && (
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ev.detail}</div>
        )}
      </div>
    );
  };

  return (
    <div className="p-3 p-md-4">
      {events.map((ev, idx) => {
        const isHome = ev.team?.id === homeTeamId;
        const showHTDivider =
          idx > 0 &&
          events[idx - 1].time?.elapsed <= 45 &&
          ev.time?.elapsed > 45 &&
          !events.slice(0, idx).some((e) => e._htShown);

        return (
          <div key={idx}>
            {/* HT Divider */}
            {showHTDivider && (
              <div className="d-flex align-items-center my-3" style={{ gap: 12 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  padding: '4px 14px', background: 'var(--bg-secondary)',
                  borderRadius: 20, border: '1px solid var(--border)',
                }}>
                  Half Time
                </span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
            )}

            <div
              className="d-flex align-items-start mb-3"
              style={{
                flexDirection: isHome ? 'row' : 'row-reverse',
                gap: 12,
              }}
            >
              <div
                style={{
                  flexShrink: 0, minWidth: 44, textAlign: 'center',
                  fontSize: '0.75rem', fontWeight: 700,
                  color: ev.type === 'Goal' ? 'var(--accent-green)' : 'var(--text-muted)',
                  paddingTop: 4,
                }}
              >
                {ev.time?.elapsed}'{ev.time?.extra ? `+${ev.time.extra}` : ''}
              </div>

              <div style={{ fontSize: '1.1rem', flexShrink: 0, paddingTop: 2 }}>
                {getEventIcon(ev.type, ev.detail)}
              </div>

              <div style={{ textAlign: isHome ? 'left' : 'right', flex: 1 }}>
                {getEventLabel(ev)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
function StatsTab({ fixtureId }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    FootballApiService.getFixtureStats(fixtureId)
      .then((data) => {
        setStats(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(() => setError('Failed to load statistics.'))
      .finally(() => setLoading(false));
  }, [fixtureId]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success" role="status"></div></div>;
  if (error) return <div className="alert alert-danger mx-3 mt-3">{error}</div>;
  if (stats.length < 2) return <div className="text-center py-5 text-muted">No statistics available.</div>;

  const homeStats = stats[0]?.statistics || [];
  const awayStats = stats[1]?.statistics || [];

  const parseVal = (v) => {
    if (v === null || v === undefined) return 0;
    if (typeof v === 'string' && v.endsWith('%')) return parseFloat(v);
    return Number(v) || 0;
  };

  return (
    <div className="p-3 p-md-4">
      <div className="d-flex justify-content-between mb-4 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="d-flex align-items-center gap-2">
          <img src={stats[0]?.team?.logo} alt="" style={{ width: 20, height: 20 }} />
          <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{stats[0]?.team?.name}</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{stats[1]?.team?.name}</span>
          <img src={stats[1]?.team?.logo} alt="" style={{ width: 20, height: 20 }} />
        </div>
      </div>

      {homeStats.map((stat, idx) => {
        const awayStat = awayStats[idx];
        if (!awayStat) return null;

        const homeVal = parseVal(stat.value);
        const awayVal = parseVal(awayStat.value);
        const max = Math.max(homeVal, awayVal, 1);
        const homePct = Math.round((homeVal / max) * 100);
        const awayPct = Math.round((awayVal / max) * 100);
        const homeWins = homeVal > awayVal;
        const awayWins = awayVal > homeVal;

        const displayHome = stat.value ?? '0';
        const displayAway = awayStat.value ?? '0';

        return (
          <div key={stat.type} style={{ marginBottom: 20 }}>
            <div className="d-flex align-items-center" style={{ marginBottom: 6 }}>
              <span style={{
                fontWeight: 700, fontSize: '0.9rem', minWidth: 48, textAlign: 'left',
                color: homeWins ? 'var(--accent-green)' : 'var(--text-primary)',
              }}>
                {displayHome}
              </span>
              <span style={{
                flex: 1, textAlign: 'center', fontSize: '0.72rem',
                color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                {stat.type}
              </span>
              <span style={{
                fontWeight: 700, fontSize: '0.9rem', minWidth: 48, textAlign: 'right',
                color: awayWins ? 'var(--accent-blue)' : 'var(--text-primary)',
              }}>
                {displayAway}
              </span>
            </div>

            <div className="d-flex" style={{ gap: 3, height: 6 }}>
              <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: '4px 0 0 4px', overflow: 'hidden', display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  width: `${homePct}%`, height: '100%',
                  background: homeWins ? '#00e676' : '#00e67655',
                  borderRadius: '4px 0 0 4px',
                  transition: 'width 0.8s ease',
                }} />
              </div>
              <div style={{ width: 2, background: 'var(--border)', flexShrink: 0 }} />
              <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: '0 4px 4px 0', overflow: 'hidden' }}>
                <div style={{
                  width: `${awayPct}%`, height: '100%',
                  background: awayWins ? '#58a6ff' : '#58a6ff55',
                  borderRadius: '0 4px 4px 0',
                  transition: 'width 0.8s ease',
                }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LineupsTab({ fixtureId }) {
  const [lineups, setLineups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    FootballApiService.getFixtureLineups(fixtureId)
      .then((data) => {
        setLineups(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(() => setError('Failed to load lineups.'))
      .finally(() => setLoading(false));
  }, [fixtureId]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success" role="status"></div></div>;
  if (error) return <div className="alert alert-danger mx-3 mt-3">{error}</div>;
  if (lineups.length < 2) return <div className="text-center py-5 text-muted">No lineup data available.</div>;

  const renderTeamLineup = (lineup, colorAccent) => (
    <div>
      <div className="d-flex align-items-center gap-2 mb-3">
        <img src={lineup.team?.logo} alt="" style={{ width: 24, height: 24 }} />
        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{lineup.team?.name}</span>
        {lineup.formation && (
          <span style={{
            fontSize: '0.7rem', fontWeight: 600,
            padding: '2px 10px', borderRadius: 12,
            background: `${colorAccent}15`, color: colorAccent,
            border: `1px solid ${colorAccent}33`,
          }}>
            {lineup.formation}
          </span>
        )}
      </div>

      {lineup.coach && (
        <div className="d-flex align-items-center gap-2 mb-3" style={{
          padding: '8px 12px', background: 'rgba(255,255,255,0.03)',
          borderRadius: 8, border: '1px solid var(--border-light)',
        }}>
          <i className="bi bi-person-badge-fill" style={{ color: colorAccent, fontSize: '0.85rem' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Coach:</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{lineup.coach.name}</span>
        </div>
      )}

      <div style={{
        fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
      }}>
        Starting XI
      </div>
      {(lineup.startXI || []).map((item, idx) => (
        <div
          key={idx}
          className="d-flex align-items-center gap-2 mb-1"
          style={{
            padding: '7px 12px', borderRadius: 6,
            background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
          }}
        >
          <span style={{
            fontWeight: 700, fontSize: '0.75rem', color: colorAccent,
            minWidth: 24, textAlign: 'center',
          }}>
            {item.player?.number}
          </span>
          <Link
            to={`/player/${item.player?.id}`}
            style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 500 }}
          >
            {item.player?.name}
          </Link>
          {item.player?.pos && (
            <span style={{
              marginLeft: 'auto', fontSize: '0.65rem', fontWeight: 600,
              padding: '1px 7px', borderRadius: 8,
              background: 'var(--bg-secondary)', color: 'var(--text-muted)',
            }}>
              {item.player.pos}
            </span>
          )}
        </div>
      ))}

      <div style={{
        fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginTop: 16, marginBottom: 8,
      }}>
        Substitutes
      </div>
      {(lineup.substitutes || []).map((item, idx) => (
        <div
          key={idx}
          className="d-flex align-items-center gap-2 mb-1"
          style={{
            padding: '6px 12px', borderRadius: 6,
            opacity: 0.7,
          }}
        >
          <span style={{
            fontWeight: 600, fontSize: '0.72rem', color: 'var(--text-muted)',
            minWidth: 24, textAlign: 'center',
          }}>
            {item.player?.number}
          </span>
          <Link
            to={`/player/${item.player?.id}`}
            style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 400 }}
          >
            {item.player?.name}
          </Link>
          {item.player?.pos && (
            <span style={{
              marginLeft: 'auto', fontSize: '0.6rem',
              color: 'var(--text-muted)',
            }}>
              {item.player.pos}
            </span>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-3 p-md-4">
      <div className="row g-4">
        <div className="col-12 col-md-6">
          {renderTeamLineup(lineups[0], '#00e676')}
        </div>
        <div className="col-12 col-md-6">
          {renderTeamLineup(lineups[1], '#58a6ff')}
        </div>
      </div>
    </div>
  );
}


export default function MatchDetailsPage() {
  const { fixtureId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    setLoading(true);
    FootballApiService.getFixtureDetails(fixtureId)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMatch(data[0]);
        } else {
          setMatch(null);
        }
        setError(null);
      })
      .catch(() => setError('Failed to load match details.'))
      .finally(() => setLoading(false));
  }, [fixtureId]);

  if (loading) {
    return (
      <div className="page-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-success" role="status" style={{ width: 48, height: 48 }}></div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="page-wrapper">
        <div className="container py-5 text-center">
          <i className="bi bi-exclamation-triangle" style={{ fontSize: '3rem', color: 'var(--loss)', display: 'block', marginBottom: 16 }} />
          <h3>{error || 'Match not found.'}</h3>
          <Link to="/matches" className="btn-accent mt-3" style={{ display: 'inline-block', textDecoration: 'none' }}>
            <i className="bi bi-arrow-left me-2" />Back to Matches
          </Link>
        </div>
      </div>
    );
  }

  const { fixture, league, teams, goals } = match;
  const isLive = ['1H', '2H', 'HT', 'ET', 'P'].includes(fixture.status.short);
  const isFinished = ['FT', 'AET', 'PEN'].includes(fixture.status.short);
  const isNotStarted = ['NS', 'TBD'].includes(fixture.status.short);

  const statusLabel = isLive
    ? `${fixture.status.elapsed}'`
    : isFinished
      ? fixture.status.short
      : isNotStarted
        ? formatMatchTime(fixture.date)
        : fixture.status.long;

  const tabs = [
    { id: 'events', label: 'Events', icon: 'bi-lightning-fill' },
    { id: 'stats', label: 'Statistics', icon: 'bi-bar-chart-fill' },
    { id: 'lineups', label: 'Lineups', icon: 'bi-people-fill' },
  ];

  return (
    <div className="page-wrapper pb-5">

      <section
        style={{
          padding: '36px 16px 0',
          background: 'linear-gradient(180deg, rgba(0,230,118,0.08) 0%, transparent 100%)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: 700, margin: '0 auto' }}>

          <div className="text-center mb-3">
            <Link
              to={`/league/${league.id}`}
              className="d-inline-flex align-items-center gap-2"
              style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.82rem' }}
            >
              <img src={league.logo} alt="" style={{ width: 18, height: 18 }} />
              {league.name}
              {league.round && <span style={{ color: 'var(--text-muted)' }}>— {league.round}</span>}
            </Link>
          </div>

          <div className="d-flex align-items-center justify-content-center" style={{ gap: 'clamp(16px, 5vw, 40px)' }}>

            <Link to={`/team/${teams.home.id}`} className="text-center" style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
              <div
                style={{
                  width: 72, height: 72, borderRadius: '50%', background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 8px', boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                }}
              >
                <img src={teams.home.logo} alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 'clamp(0.8rem, 2.5vw, 0.95rem)' }}>{teams.home.name}</div>
            </Link>

            <div className="text-center" style={{ flexShrink: 0 }}>
              {(isFinished || isLive) ? (
                <div style={{ fontSize: 'clamp(2rem, 7vw, 3rem)', fontWeight: 800, lineHeight: 1 }}>
                  <span style={{ color: goals.home > goals.away ? 'var(--accent-green)' : 'var(--text-primary)' }}>
                    {goals.home}
                  </span>
                  <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>-</span>
                  <span style={{ color: goals.away > goals.home ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                    {goals.away}
                  </span>
                </div>
              ) : (
                <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  VS
                </div>
              )}
              <div
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 14px', borderRadius: 20, marginTop: 8,
                  fontSize: '0.75rem', fontWeight: 700,
                  background: isLive ? 'rgba(248,81,73,0.12)' : 'rgba(255,255,255,0.05)',
                  color: isLive ? 'var(--live)' : 'var(--text-muted)',
                  border: `1px solid ${isLive ? 'rgba(248,81,73,0.3)' : 'var(--border)'}`,
                }}
              >
                {isLive && (
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: 'var(--live)',
                    animation: 'pulse-live 1.5s infinite',
                  }} />
                )}
                {statusLabel}
              </div>
            </div>

            <Link to={`/team/${teams.away.id}`} className="text-center" style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
              <div
                style={{
                  width: 72, height: 72, borderRadius: '50%', background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 8px', boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                }}
              >
                <img src={teams.away.logo} alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 'clamp(0.8rem, 2.5vw, 0.95rem)' }}>{teams.away.name}</div>
            </Link>
          </div>

          <div
            className="d-flex justify-content-center gap-4 flex-wrap mt-3"
            style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
          >
            <span><i className="bi bi-calendar3 me-1" />{formatMatchDate(fixture.date)}</span>
            {fixture.venue?.name && (
              <span><i className="bi bi-geo-alt-fill me-1" />{fixture.venue.name}{fixture.venue.city ? `, ${fixture.venue.city}` : ''}</span>
            )}
            {fixture.referee && (
              <span><i className="bi bi-person-badge me-1" />{fixture.referee}</span>
            )}
          </div>

          <div className="d-flex justify-content-center" style={{ gap: 24, marginTop: 20 }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none', border: 'none',
                  padding: '12px 0',
                  color: activeTab === tab.id ? 'var(--accent-green)' : 'var(--text-secondary)',
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  fontSize: '0.9rem', cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? '3px solid var(--accent-green)' : '3px solid transparent',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 7,
                  whiteSpace: 'nowrap',
                }}
              >
                <i className={`bi ${tab.icon}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 700, margin: '24px auto', padding: '0 16px' }}>
        <div className="fs-card" style={{ overflow: 'hidden' }}>
          {activeTab === 'events' && <EventsTab fixtureId={fixtureId} homeTeamId={teams.home.id} />}
          {activeTab === 'stats' && <StatsTab fixtureId={fixtureId} />}
          {activeTab === 'lineups' && <LineupsTab fixtureId={fixtureId} />}
        </div>
      </section>
    </div>
  );
}
