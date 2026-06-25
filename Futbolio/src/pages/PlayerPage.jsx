import React, { useState, useEffect } from 'react';
import { api } from '../services/member3Api';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { useParams, useNavigate } from 'react-router-dom';

const DEMO_PLAYER = {
  id: 306, name: 'Salah', fullname: 'Mohamed Salah', photo: 'https://media.api-sports.io/football/players/306.png', age: 31,
  birthDate: '1992-06-15', birthPlace: 'Basyoun', birthCountry: 'Egypt', nationality: 'Egypt',
  height: '175 cm', weight: '71 kg', number: 11, position: 'Attacker', teamName: 'Liverpool',
  radarStats: [
    { subject: 'Finishing', A: 95 }, { subject: 'Passing', A: 82 }, { subject: 'Dribbling', A: 88 },
    { subject: 'Defending', A: 45 }, { subject: 'Shooting', A: 92 }, { subject: 'Work Rate', A: 85 }
  ],
  seasonHistory: [
    { season: '22/23', goals: 19, assists: 12 },
    { season: '23/24', goals: 21, assists: 10 },
  ],
  detailedStats: {
    appearances: 32, lineups: 31, minutesPlayed: 2850, rating: '7.8',
    goals: 21, assists: 10, shotsTotal: 98, shotsOnTarget: 45, passesTotal: 1050, keyPasses: 65, passAccuracy: '81%',
    dribblesCompleted: 55, dribbleAttempts: 95, tackles: 12, interceptions: 8, blocks: 2,
    duelsWon: 110, duelsTotal: 250, foulsDrawn: 45, foulsCommitted: 15, yellowCards: 2, redCards: 0,
    penaltiesScored: 5, penaltiesMissed: 1, cleanSheets: 0, savesMade: 0, goalsConceded: 0, savePercentage: '–'
  }
};

export default function PlayerPage() {
  const { id: playerId } = useParams();
  const navigate = useNavigate();
  const onBackClick = () => navigate(-1);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await api.fetchPlayerProfile(playerId);
        if (!cancelled) setPlayer(data);
      } catch (err) {
        console.warn('API failed, using demo player fallback:', err.message);
        if (!cancelled) {
          setPlayer(DEMO_PLAYER);
          setError(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [playerId]);

  if (loading) return (
    <div className="loader-wrap">
      <div className="spinner-custom"/>
      <p>Loading player statistics…</p>
    </div>
  );

  if (error || !player) return (
    <div className="loader-wrap">
      <p style={{ color: 'var(--color-loss)' }}>{error || 'Player not found'}</p>
      <button className="btn-back" onClick={onBackClick}>← Back</button>
    </div>
  );

  const s    = player.detailedStats;
  const isGK = player.position?.toLowerCase().includes('goalkeeper');

  const StatCard = ({ label, value, color, span2 = false }) => (
    <div className={span2 ? 'col-12' : 'col-6'}>
      <div className="detailed-stat-card" style={color ? { borderColor: `${color}33` } : {}}>
        <span className="detailed-stat-value" style={color ? { color } : {}}>{value}</span>
        <span className="detailed-stat-label">{label}</span>
      </div>
    </div>
  );

  return (
    <div className="container-xl py-4">

      <button className="btn-back" onClick={onBackClick}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to {player.teamName}
      </button>

    
      <div className="profile-banner mb-4">
        <div className="profile-logo-box player">
          <img src={player.photo} alt={player.name} />
        </div>
        <div className="profile-info">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '0.8rem' }}>#{player.number}</span>
            <span style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)', border: '1px solid var(--color-accent-border)', borderRadius: 20, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700 }}>
              {player.position}
            </span>
          </div>
          <h1>{player.fullname}</h1>
          <ul className="profile-meta-list mt-2">
            <li className="profile-meta-item">🏟 {player.teamName}</li>
            <li className="profile-meta-item">🎂 Age {player.age} ({player.birthDate})</li>
            <li className="profile-meta-item">🌍 {player.nationality}</li>
            <li className="profile-meta-item">📐 {player.height} / {player.weight}</li>
            <li className="profile-meta-item">📍 {player.birthPlace}, {player.birthCountry}</li>
          </ul>
        </div>
      </div>

     
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card-dark h-100">
            <div className="card-title-row">Attributes Radar</div>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={player.radarStats}>
                  <PolarGrid stroke="#242f44"/>
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}/>
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} stroke="#242f44"/>
                  <Radar name={player.name} dataKey="A" stroke="var(--color-accent)" fill="var(--color-accent)" fillOpacity={0.25}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-dark h-100">
            <div className="card-title-row">Goals & Assists Progression</div>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={player.seasonHistory} margin={{ top: 16, right: 16, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#242f44"/>
                  <XAxis dataKey="season" tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#242f44"/>
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#242f44"/>
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: '#fff' }}/>
                  <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}/>
                  <Bar dataKey="goals"   fill="var(--color-accent)" radius={[4,4,0,0]} name="Goals"  />
                  <Bar dataKey="assists" fill="#3b82f6"             radius={[4,4,0,0]} name="Assists"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

    
      <div className="row g-4">

       
        <div className="col-md-6 col-lg-4">
          <div className="card-dark h-100">
            <div className="card-title-row">General Stats</div>
            <div className="row g-2">
              <StatCard label="Appearances"  value={s.appearances} />
              <StatCard label="Lineups"       value={s.lineups} />
              <StatCard label="Mins Played"   value={s.minutesPlayed} />
              <StatCard label="Match Rating"  value={s.rating} color="var(--color-accent)" />
            </div>
          </div>
        </div>

       
        <div className="col-md-6 col-lg-4">
          <div className="card-dark h-100">
            <div className="card-title-row">Attacking Output</div>
            <div className="row g-2">
              <StatCard label="Goals"           value={s.goals}   color="var(--color-win)" />
              <StatCard label="Assists"         value={s.assists} color="#3b82f6" />
              <StatCard label="Shots (on tgt)"  value={`${s.shotsTotal} (${s.shotsOnTarget})`} />
              <StatCard label="Dribbles"        value={`${s.dribblesCompleted}/${s.dribbleAttempts}`} />
            </div>
          </div>
        </div>

      
        <div className="col-md-6 col-lg-4">
          <div className="card-dark h-100">
            <div className="card-title-row">Passing</div>
            <div className="row g-2">
              <StatCard label="Total Passes" value={s.passesTotal} />
              <StatCard label="Key Passes"   value={s.keyPasses} />
              <StatCard label="Pass Accuracy" value={s.passAccuracy} color="var(--color-accent)" span2 />
            </div>
          </div>
        </div>

     
        <div className="col-md-6 col-lg-4">
          <div className="card-dark h-100">
            <div className="card-title-row">{isGK ? 'Goalkeeper Stats' : 'Defensive Metrics'}</div>
            <div className="row g-2">
              {isGK ? (
                <>
                  <StatCard label="Clean Sheets" value={s.cleanSheets}      color="var(--color-win)" />
                  <StatCard label="Saves"         value={s.savesMade} />
                  <StatCard label="Conceded"      value={s.goalsConceded}    color="var(--color-loss)" />
                  <StatCard label="Save Ratio"    value={s.savePercentage} />
                </>
              ) : (
                <>
                  <StatCard label="Tackles"       value={s.tackles} />
                  <StatCard label="Interceptions" value={s.interceptions} />
                  <StatCard label="Blocks"        value={s.blocks} span2 />
                </>
              )}
            </div>
          </div>
        </div>

     
        <div className="col-md-6 col-lg-4">
          <div className="card-dark h-100">
            <div className="card-title-row">Physicality & Duels</div>
            <div className="row g-2">
              <StatCard label="Duels Won/Total"  value={`${s.duelsWon}/${s.duelsTotal}`} span2 />
              <StatCard label="Fouls Drawn"      value={s.foulsDrawn} />
              <StatCard label="Fouls Committed"  value={s.foulsCommitted} />
            </div>
          </div>
        </div>

     
        <div className="col-md-6 col-lg-4">
          <div className="card-dark h-100">
            <div className="card-title-row">Discipline</div>
            <div className="row g-2">
              <StatCard label="Yellow Cards"     value={s.yellowCards}     color="var(--color-draw)" />
              <StatCard label="Red Cards"        value={s.redCards}        color="var(--color-loss)" />
              <StatCard label="Pens Scored"      value={s.penaltiesScored} />
              <StatCard label="Pens Missed"      value={s.penaltiesMissed} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
