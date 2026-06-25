import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FootballApiService from '../services/footballApiService';
import { ALL_LEAGUES_MAP } from '../constants/leagues';

function StandingsTab({ leagueId }) {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    FootballApiService.getStandings(leagueId)
      .then((data) => {
        if (data && data.length > 0 && data[0].league && data[0].league.standings) {
          setStandings(data[0].league.standings[0] || []);
        } else {
          setStandings([]);
        }
        setError(null);
      })
      .catch((err) => setError('Failed to load standings. API limit reached or network error.'))
      .finally(() => setLoading(false));
  }, [leagueId]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mx-3 mt-3">{error}</div>;
  }

  if (standings.length === 0) {
    return <div className="text-center py-5 text-muted">No standings available.</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-dark table-hover mb-0" style={{ fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
            <th className="py-3 px-3">#</th>
            <th className="py-3 px-3">Team</th>
            <th className="py-3 text-center">PL</th>
            <th className="py-3 text-center">W</th>
            <th className="py-3 text-center">D</th>
            <th className="py-3 text-center">L</th>
            <th className="py-3 text-center d-none d-md-table-cell">GD</th>
            <th className="py-3 text-center">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => (
            <tr key={row.team.id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
              <td className="px-3 align-middle" style={{ fontWeight: 600 }}>{row.rank}</td>
              <td className="px-3 align-middle">
                <Link to={`/team/${row.team.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={row.team.logo} alt={row.team.name} style={{ width: 24, height: 24, objectFit: 'contain' }} />
                  <span style={{ fontWeight: 500 }}>{row.team.name}</span>
                </Link>
              </td>
              <td className="text-center align-middle">{row.all.played}</td>
              <td className="text-center align-middle">{row.all.win}</td>
              <td className="text-center align-middle">{row.all.draw}</td>
              <td className="text-center align-middle">{row.all.lose}</td>
              <td className="text-center align-middle d-none d-md-table-cell">{row.goalsDiff}</td>
              <td className="text-center align-middle" style={{ fontWeight: 700, color: 'var(--accent-green)' }}>
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MatchesTab({ leagueId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    FootballApiService.getLeagueFixtures(leagueId)
      .then((data) => {
        const sorted = (Array.isArray(data) ? data : []).sort((a, b) => new Date(b.fixture.date) - new Date(a.fixture.date));
        setMatches(sorted);
        setError(null);
      })
      .catch((err) => setError('Failed to load matches.'))
      .finally(() => setLoading(false));
  }, [leagueId]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success" role="status"></div></div>;
  if (error) return <div className="alert alert-danger mx-3 mt-3">{error}</div>;
  if (matches.length === 0) return <div className="text-center py-5 text-muted">No matches found.</div>;

  return (
    <div className="p-3">
      {matches.slice(0, 30).map((match) => { // Limit to 30 to avoid huge lists
        const date = new Date(match.fixture.date);
        const dateStr = date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
        const isLive = ['1H','2H','HT','ET','P'].includes(match.fixture.status.short);
        const isFinished = ['FT', 'AET', 'PEN'].includes(match.fixture.status.short);

        return (
          <Link key={match.fixture.id} to={`/match/${match.fixture.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="fs-card mb-3 p-3 d-flex align-items-center justify-content-between">
              {/* Home Team */}
              <div className="d-flex align-items-center gap-3" style={{ flex: 1 }}>
                <img src={match.teams.home.logo} alt="" style={{ width: 32, height: 32 }} />
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{match.teams.home.name}</span>
              </div>

              {/* Score / Status */}
              <div className="text-center" style={{ flex: '0 0 100px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                  {dateStr}
                </div>
                {isFinished || isLive ? (
                  <div style={{ 
                    fontSize: '1.2rem', fontWeight: 800, 
                    color: isLive ? 'var(--accent-green)' : 'var(--text-primary)' 
                  }}>
                    {match.goals.home} - {match.goals.away}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
                {isLive && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 600, marginTop: 4 }}>
                    {match.fixture.status.elapsed}'
                  </div>
                )}
              </div>

              {/* Away Team */}
              <div className="d-flex align-items-center justify-content-end gap-3" style={{ flex: 1 }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem', textAlign: 'right' }}>{match.teams.away.name}</span>
                <img src={match.teams.away.logo} alt="" style={{ width: 32, height: 32 }} />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function StatsTab({ leagueId, type }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchStats = type === 'scorers' 
      ? FootballApiService.getTopScorers(leagueId)
      : FootballApiService.getTopAssists(leagueId);

    fetchStats
      .then((data) => {
        setPlayers(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => setError(`Failed to load top ${type}.`))
      .finally(() => setLoading(false));
  }, [leagueId, type]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success" role="status"></div></div>;
  if (error) return <div className="alert alert-danger mx-3 mt-3">{error}</div>;
  if (players.length === 0) return <div className="text-center py-5 text-muted">No data available.</div>;

  return (
    <div className="table-responsive">
      <table className="table table-dark table-hover mb-0" style={{ fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
            <th className="py-3 px-3">#</th>
            <th className="py-3 px-3">Player</th>
            <th className="py-3 px-3">Team</th>
            <th className="py-3 px-3 text-center">{type === 'scorers' ? 'Goals' : 'Assists'}</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, index) => {
            const statValue = type === 'scorers' 
              ? p.statistics[0].goals.total 
              : p.statistics[0].goals.assists;
              
            return (
              <tr key={p.player.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-3 align-middle" style={{ fontWeight: 600 }}>{index + 1}</td>
                <td className="px-3 align-middle">
                  <Link to={`/player/${p.player.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={p.player.photo} alt={p.player.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontWeight: 500 }}>{p.player.name}</span>
                  </Link>
                </td>
                <td className="px-3 align-middle">
                  <div className="d-flex align-items-center gap-2">
                    <img src={p.statistics[0].team.logo} alt="" style={{ width: 20, height: 20 }} />
                    {p.statistics[0].team.name}
                  </div>
                </td>
                <td className="px-3 align-middle text-center" style={{ fontWeight: 700, color: 'var(--accent-green)', fontSize: '1.1rem' }}>
                  {statValue || 0}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function LeaguePage() {
  const { leagueId } = useParams();
  const [activeTab, setActiveTab] = useState('standings');
  
  const leagueInfo = ALL_LEAGUES_MAP[leagueId];

  const tabs = [
    { id: 'standings', label: 'Standings', icon: 'bi-list-ol' },
    { id: 'matches', label: 'Matches', icon: 'bi-calendar3' },
    { id: 'scorers', label: 'Top Scorers', icon: 'bi-record-circle' },
    { id: 'assists', label: 'Top Assists', icon: 'bi-person-check' },
  ];

  return (
    <div className="page-wrapper pb-5">
      <section 
        style={{ 
          padding: '40px 24px 0', 
          background: 'linear-gradient(180deg, rgba(0,230,118,0.1) 0%, transparent 100%)',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="d-flex align-items-center gap-4 mb-4">
            <div 
              style={{ 
                width: 100, height: 100, borderRadius: '50%', background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)', flexShrink: 0
              }}
            >
              {leagueInfo ? (
                <img src={leagueInfo.logo} alt="" style={{ width: 64, height: 64, objectFit: 'contain' }} />
              ) : (
                <i className="bi bi-trophy text-muted" style={{ fontSize: '2.5rem' }}></i>
              )}
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, margin: 0 }}>
                {leagueInfo ? leagueInfo.name : 'League Details'}
              </h1>
              {leagueInfo && (
                <div className="d-flex align-items-center gap-2 mt-2" style={{ color: 'var(--text-secondary)' }}>
                  {leagueInfo.flag && <img src={leagueInfo.flag} alt="" style={{ width: 18, height: 18, borderRadius: '50%' }} />}
                  <span style={{ fontSize: '1rem' }}>{leagueInfo.country}</span>
                </div>
              )}
            </div>
          </div>

          <div className="d-flex" style={{ overflowX: 'auto', gap: 24, paddingBottom: 0 }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '12px 0',
                  color: activeTab === tab.id ? 'var(--accent-green)' : 'var(--text-secondary)',
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? '3px solid var(--accent-green)' : '3px solid transparent',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  whiteSpace: 'nowrap'
                }}
              >
                <i className={`bi ${tab.icon}`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1000, margin: '24px auto', padding: '0 16px' }}>
        <div className="fs-card" style={{ overflow: 'hidden' }}>
          {activeTab === 'standings' && <StandingsTab leagueId={leagueId} />}
          {activeTab === 'matches' && <MatchesTab leagueId={leagueId} />}
          {activeTab === 'scorers' && <StatsTab leagueId={leagueId} type="scorers" />}
          {activeTab === 'assists' && <StatsTab leagueId={leagueId} type="assists" />}
        </div>
      </section>
    </div>
  );
}
