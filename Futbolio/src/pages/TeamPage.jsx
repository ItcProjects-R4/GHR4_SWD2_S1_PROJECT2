import React, { useState, useEffect } from 'react';
import { api, LEAGUES } from '../services/member3Api';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useParams, useNavigate } from 'react-router-dom';

const DEMO_TEAM = {
  id: 40, name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png',
  founded: 1892, stadium: 'Anfield', stadiumCity: 'Liverpool', stadiumCapacity: '61,000',
  stadiumImage: 'https://media.api-sports.io/football/venues/550.png', coachFigma: 'A. Slot',
  stats: { matches: 38, goalsFor: 89, goalsAgainst: 41, cleanSheets: 14 },
  form: { statusText: 'Excellent Form', bubbles: [{result: 'w', comp: 'PL'}, {result: 'w', comp: 'PL'}, {result: 'd', comp: 'CL'}, {result: 'w', comp: 'PL'}] },
  recentMatches: [
    { id: 1, date: '12 May', competition: 'Premier League', homeAway: 'H', opponent: 'Aston Villa', score: '3 - 1', outcome: 'w' },
    { id: 2, date: '05 May', competition: 'Premier League', homeAway: 'A', opponent: 'Tottenham', score: '2 - 2', outcome: 'd' },
    { id: 3, date: '28 Apr', competition: 'Premier League', homeAway: 'A', opponent: 'West Ham', score: '1 - 2', outcome: 'l' },
  ],
  goalsByMinute: [
    { minute: '0-15', GoalsFor: 12, GoalsAgainst: 4 },
    { minute: '16-30', GoalsFor: 15, GoalsAgainst: 5 },
    { minute: '31-45', GoalsFor: 10, GoalsAgainst: 8 },
    { minute: '46-60', GoalsFor: 18, GoalsAgainst: 6 },
    { minute: '61-75', GoalsFor: 14, GoalsAgainst: 9 },
    { minute: '76-90', GoalsFor: 20, GoalsAgainst: 9 },
  ],
  lineups: [{ formation: '4-3-3', played: 30 }, { formation: '4-2-3-1', played: 8 }],
  cleanSheetsDetail: { home: 8, away: 6 },
  penalties: { scored: 6, total: 7 },
  squad: {
    forwards: [{ id: 306, name: 'M. Salah', number: 11, age: 31, photo: 'https://media.api-sports.io/football/players/306.png' }, { id: 2887, name: 'D. Núñez', number: 9, age: 24, photo: 'https://media.api-sports.io/football/players/2887.png' }],
    midfielders: [{ id: 6206, name: 'A. Mac Allister', number: 10, age: 25, photo: 'https://media.api-sports.io/football/players/6206.png' }],
    defenders: [{ id: 290, name: 'V. van Dijk', number: 4, age: 32, photo: 'https://media.api-sports.io/football/players/290.png' }, { id: 289, name: 'T. Alexander-Arnold', number: 66, age: 25, photo: 'https://media.api-sports.io/football/players/289.png' }],
    goalkeepers: [{ id: 280, name: 'Alisson', number: 1, age: 31, photo: 'https://media.api-sports.io/football/players/280.png' }]
  }
};

export default function TeamPage() {
  const { id: teamId } = useParams();
  const navigate = useNavigate();
  const onPlayerClick = (pid) => navigate(`/player/${pid}`);
  const onBackClick = () => navigate(-1);
  const [leagueId, setLeagueId] = useState(39);
  const [season, setSeason]     = useState(2024);
  const [team, setTeam]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.fetchTeamProfile(teamId, leagueId, season);
        if (!cancelled) setTeam(data);
      } catch (err) {
        console.warn('API failed, using demo team fallback:', err.message);
        if (!cancelled) {
          setTeam(DEMO_TEAM);
          setError(null); 
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [teamId, leagueId, season]);

  if (loading) return (
    <div className="loader-wrap">
      <div className="spinner-custom"/>
      <p>Loading team profile…</p>
    </div>
  );

  if (error || !team) return (
    <div className="loader-wrap">
      <p style={{ color: 'var(--color-loss)' }}>{error || 'Team not found'}</p>
      {onBackClick && (
        <button className="btn-back" onClick={onBackClick}>← Back</button>
      )}
    </div>
  );

  const SquadSection = ({ title, players, posClass }) => (
    players?.length > 0 && (
      <div className="mb-3">
        <span className={`squad-position-title ${posClass} mb-2 d-inline-block`}>{title}</span>
        {players.map(p => (
          <div key={p.id} className="player-row-card" onClick={() => onPlayerClick(p.id)}>
            <div className="player-row-left">
              <span className="player-row-number">{p.number}</span>
              <div className="player-row-avatar">
                <img src={p.photo} alt={p.name} />
              </div>
              <span className="player-row-name">{p.name}</span>
            </div>
            <div className="player-row-right">
              <span className="player-row-age">{p.age}yo</span>
              <span className="player-row-stats">Profile →</span>
            </div>
          </div>
        ))}
      </div>
    )
  );

  return (
    <div className="container-xl py-4">

     
      <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
        {onBackClick && (
          <button className="btn-back" onClick={onBackClick}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
        )}
        <div className="ms-auto d-flex gap-2 flex-wrap">
          <select className="select-dark" style={{ width: 'auto' }} value={season} onChange={e => setSeason(parseInt(e.target.value))}>
            {[2024, 2023, 2022].map(y => <option key={y} value={y}>{y}/{y - 1999}</option>)}
          </select>
        </div>
      </div>

    
      <div
        className="profile-banner mb-4"
        style={{
          backgroundImage: team.stadiumImage
            ? `linear-gradient(to right, rgba(18,24,36,0.97) 55%, rgba(18,24,36,0.3) 100%), url(${team.stadiumImage})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="profile-logo-box">
          <img src={team.logo} alt={team.name} />
        </div>
        <div className="profile-info">
          <h1>{team.name}</h1>
          <ul className="profile-meta-list mt-2">
            <li className="profile-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Founded {team.founded}
            </li>
            <li className="profile-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {team.stadium} ({team.stadiumCapacity}) — {team.stadiumCity}
            </li>
            <li className="profile-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Coach: {team.coachFigma}
            </li>
          </ul>
        </div>
      </div>

      <div className="row g-4">
       
        <div className="col-lg-7">

        
          <div className="card-dark">
            <div className="card-title-row d-flex justify-content-between">
              <span className="d-flex align-items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                Form Guide
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 700 }}>
                {team.form.statusText}
              </span>
            </div>
            <div className="d-flex gap-2 mb-3 flex-wrap">
              {team.form.bubbles.map((b, i) => (
                <div key={i} className="d-flex flex-column align-items-center gap-1">
                  <div className={`form-bubble ${b.result}`}>{b.result.toUpperCase()}</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', maxWidth: 40, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.comp}</div>
                </div>
              ))}
            </div>
            <div className="row g-2">
              {[
                { label: 'Matches', value: team.stats.matches, cls: '' },
                { label: 'Goals For', value: team.stats.goalsFor, cls: 'win' },
                { label: 'Goals Ag.', value: team.stats.goalsAgainst, cls: 'loss' },
                { label: 'Clean Sht', value: team.stats.cleanSheets, cls: 'info' },
              ].map(s => (
                <div key={s.label} className="col-3">
                  <div className={`stat-box ${s.cls}`}>
                    <span className="stat-value">{s.value}</span>
                    <span className="stat-label">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        
          <div className="card-dark">
            <div className="card-title-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              First Team Squad
            </div>
            <SquadSection title="Forwards"    players={team.squad.forwards}    posClass="forwards"    />
            <SquadSection title="Midfielders" players={team.squad.midfielders} posClass="midfielders" />
            <SquadSection title="Defenders"   players={team.squad.defenders}   posClass="defenders"   />
            <SquadSection title="Goalkeepers" players={team.squad.goalkeepers} posClass="goalkeepers" />
          </div>
        </div>

        
        <div className="col-lg-5">
          <div className="card-dark">
            <div className="card-title-row">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Recent Matches
            </div>
            {team.recentMatches.map(m => (
              <div key={m.id} className="recent-match-item">
                <div className="recent-match-meta">
                  <span>{m.date}</span>
                  <span>{m.competition}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      style={{
                        fontSize: '11px', fontWeight: 700, padding: '2px 8px',
                        borderRadius: 4, background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)', color: 'var(--text-muted)'
                      }}
                    >
                      {m.homeAway}
                    </span>
                    <span style={{ fontSize: '0.87rem' }}>{m.opponent}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="recent-match-score">{m.score}</span>
                    <span className={`outcome-pill ${m.outcome}`}>{m.outcome.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    
      {team.goalsByMinute?.length > 0 && (
        <div className="card-dark mt-2">
          <div className="card-title-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            Goals by 15-Min Interval & Formations
          </div>
          <div className="row g-4">
            <div className="col-lg-8">
              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={team.goalsByMinute}>
                    <defs>
                      <linearGradient id="gf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="var(--color-win)"  stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-win)"  stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="var(--color-loss)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-loss)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#242f44"/>
                    <XAxis dataKey="minute" tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#242f44"/>
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#242f44"/>
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: '#fff' }}/>
                    <Area type="monotone" dataKey="GoalsFor"     stroke="var(--color-win)"  fill="url(#gf)" name="Scored"   />
                    <Area type="monotone" dataKey="GoalsAgainst" stroke="var(--color-loss)" fill="url(#ga)" name="Conceded" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="col-lg-4">
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Formations</p>
              {team.lineups.map((l, i) => (
                <div key={i} className="d-flex justify-content-between align-items-center mb-2 px-3 py-2" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontWeight: 700 }}>{l.formation}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{l.played} matches</span>
                </div>
              ))}
              <div className="row g-2 mt-2">
                <div className="col-6">
                  <div className="stat-box info">
                    <span className="stat-value">{team.cleanSheetsDetail.home}H/{team.cleanSheetsDetail.away}A</span>
                    <span className="stat-label">Clean Sheets</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-box win">
                    <span className="stat-value">{team.penalties.scored}/{team.penalties.total}</span>
                    <span className="stat-label">Penalties</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
