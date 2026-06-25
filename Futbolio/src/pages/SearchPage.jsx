import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import FootballApiService from '../services/footballApiService';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('teams');
  const [teamResults, setTeamResults] = useState([]);
  const [playerResults, setPlayerResults] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [searched, setSearched] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setTeamResults([]);
      setPlayerResults([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      setSearched(true);

      setLoadingTeams(true);
      FootballApiService.searchTeams(q)
        .then((data) => setTeamResults(Array.isArray(data) ? data.slice(0, 20) : []))
        .catch(() => setTeamResults([]))
        .finally(() => setLoadingTeams(false));

      setLoadingPlayers(true);
      FootballApiService.searchPlayers(q)
        .then((data) => setPlayerResults(Array.isArray(data) ? data.slice(0, 20) : []))
        .catch(() => setPlayerResults([]))
        .finally(() => setLoadingPlayers(false));
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const tabs = [
    { id: 'teams', label: 'Teams', icon: 'bi-shield-fill', count: teamResults.length },
    { id: 'players', label: 'Players', icon: 'bi-person-fill', count: playerResults.length },
  ];

  return (
    <div className="page-wrapper pb-5">

      <section
        style={{
          padding: '48px 24px 36px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(88,166,255,0.07) 0%, transparent 100%)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div
            style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(88,166,255,0.1)',
              border: '1px solid rgba(88,166,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <i className="bi bi-search" style={{ fontSize: '1.6rem', color: 'var(--accent-blue)' }} />
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, marginBottom: 8 }}>
            Search
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: 24 }}>
            Find any team or player across all leagues worldwide.
          </p>

          <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
            <i
              className="bi bi-search"
              style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', fontSize: '1rem',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '1rem', padding: 0,
                }}
              >
                <i className="bi bi-x-lg" />
              </button>
            )}
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for a team or player..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 44px 14px 48px',
                background: 'var(--bg-secondary)',
                border: '2px solid var(--border)',
                borderRadius: 12,
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--accent-blue)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>
        </div>
      </section>

      {searched && (
        <div
          style={{
            position: 'sticky', top: 56, zIndex: 20,
            background: 'rgba(13,17,23,0.96)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px' }}>
            <div className="d-flex" style={{ gap: 0 }}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const isLoading = tab.id === 'teams' ? loadingTeams : loadingPlayers;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      background: 'none', border: 'none',
                      padding: '13px 24px',
                      color: isActive ? 'var(--accent-green)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      borderBottom: isActive ? '2px solid var(--accent-green)' : '2px solid transparent',
                      transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}
                  >
                    <i className={`bi ${tab.icon}`} style={{ fontSize: '0.85rem' }} />
                    {tab.label}
                    {!isLoading && searched && (
                      <span
                        style={{
                          fontSize: '0.65rem', fontWeight: 700,
                          padding: '1px 8px', borderRadius: 10,
                          background: isActive ? 'rgba(0,230,118,0.15)' : 'rgba(255,255,255,0.07)',
                          color: isActive ? 'var(--accent-green)' : 'var(--text-muted)',
                        }}
                      >
                        {tab.count}
                      </span>
                    )}
                    {isLoading && (
                      <div
                        className="spinner-border"
                        style={{ width: 14, height: 14, borderWidth: 2, color: 'var(--accent-green)' }}
                        role="status"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <section style={{ maxWidth: 600, margin: '24px auto', padding: '0 24px' }}>

        {/* Initial state — no search yet */}
        {!searched && (
          <div className="text-center" style={{ paddingTop: 60 }}>
            <i className="bi bi-search" style={{ fontSize: '3rem', color: 'rgba(88,166,255,0.2)', display: 'block', marginBottom: 16 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Start typing to search for teams and players.
            </p>
          </div>
        )}

        {searched && activeTab === 'teams' && (
          <>
            {loadingTeams ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status" style={{ width: 36, height: 36 }}></div>
              </div>
            ) : teamResults.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-shield-x" style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,0.1)', display: 'block', marginBottom: 12 }} />
                <p style={{ color: 'var(--text-muted)' }}>No teams found for "{query}"</p>
              </div>
            ) : (
              <div>
                {teamResults.map((item) => (
                  <Link
                    key={item.team.id}
                    to={`/team/${item.team.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div
                      className="fs-card d-flex align-items-center gap-3 mb-2"
                      style={{ padding: '12px 16px' }}
                    >
                      <div
                        style={{
                          width: 44, height: 44, borderRadius: '50%',
                          background: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}
                      >
                        <img
                          src={item.team.logo}
                          alt={item.team.name}
                          style={{ width: 30, height: 30, objectFit: 'contain' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.team.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {item.team.country}
                          {item.venue?.name && ` · ${item.venue.name}`}
                        </div>
                      </div>
                      {item.team.founded && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Est. {item.team.founded}
                        </span>
                      )}
                      <i className="bi bi-chevron-right" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {searched && activeTab === 'players' && (
          <>
            {loadingPlayers ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status" style={{ width: 36, height: 36 }}></div>
              </div>
            ) : playerResults.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-person-x" style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,0.1)', display: 'block', marginBottom: 12 }} />
                <p style={{ color: 'var(--text-muted)' }}>No players found for "{query}"</p>
              </div>
            ) : (
              <div>
                {playerResults.map((item) => (
                  <Link
                    key={item.player.id}
                    to={`/player/${item.player.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div
                      className="fs-card d-flex align-items-center gap-3 mb-2"
                      style={{ padding: '12px 16px' }}
                    >
                      <div
                        style={{
                          width: 44, height: 44, borderRadius: '50%',
                          background: 'var(--bg-secondary)',
                          border: '2px solid var(--border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, overflow: 'hidden',
                        }}
                      >
                        {item.player.photo ? (
                          <img
                            src={item.player.photo}
                            alt={item.player.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <i className="bi bi-person-fill" style={{ fontSize: '1.3rem', color: 'var(--text-muted)' }} />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          {item.player.firstname} {item.player.lastname}
                        </div>
                        <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {item.player.nationality && <span>{item.player.nationality}</span>}
                          {item.player.age && <span>· {item.player.age} yrs</span>}
                        </div>
                      </div>

                      <i className="bi bi-chevron-right" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
