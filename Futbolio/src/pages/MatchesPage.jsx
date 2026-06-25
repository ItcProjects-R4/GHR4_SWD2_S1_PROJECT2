import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FootballApiService from '../services/footballApiService';
import { SkeletonCard } from '../components/Loader';

function DateNav({ selectedDate, onDateChange }) {
  const dateInputRef = useRef(null);

  const formatLabel = (dateStr) => {
    const d = new Date(dateStr + 'T12:00:00');
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';
    if (dateStr === tomorrow) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const shift = (days) => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + days);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const openPicker = () => {
    try {
      dateInputRef.current?.showPicker();
    } catch (e) {
      dateInputRef.current?.focus();
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
      <button onClick={() => shift(-1)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px 12px' }}>
        <i className="bi bi-chevron-left"></i>
      </button>

      <div style={{ position: 'relative' }}>
        <button
          onClick={openPicker}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', cursor: 'pointer', padding: '6px 20px', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, minWidth: 160, justifyContent: 'center' }}
        >
          <i className="bi bi-calendar3" style={{ color: 'var(--accent-green)' }}></i>
          {formatLabel(selectedDate)}
        </button>
        <input
          ref={dateInputRef}
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          style={{ position: 'absolute', top: '100%', left: 0, opacity: 0, width: 0, height: 0, padding: 0, border: 'none', pointerEvents: 'none' }}
        />
      </div>

      <button onClick={() => shift(1)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px 12px' }}>
        <i className="bi bi-chevron-right"></i>
      </button>

      {selectedDate !== new Date().toISOString().split('T')[0] && (
        <button
          onClick={() => onDateChange(new Date().toISOString().split('T')[0])}
          style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)', borderRadius: 8, color: 'var(--accent-green)', cursor: 'pointer', padding: '6px 16px', fontSize: '0.85rem', fontWeight: 600, marginLeft: 8 }}
        >
          Today
        </button>
      )}
    </div>
  );
}

function MatchRow({ match }) {
  const navigate = useNavigate();
  const fixture = match.fixture;
  const teams = match.teams;
  const goals = match.goals;
  const status = fixture.status;
  const isLive = ['1H','2H','HT','ET','P'].includes(status.short);
  const isFinished = ['FT', 'AET', 'PEN'].includes(status.short);

  const matchTime = new Date(fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className="fs-card mb-2 d-flex align-items-center px-3 py-2"
      onClick={() => navigate(`/match/${fixture.id}`)}
      style={{ cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s', border: '1px solid var(--border)' }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ width: 65, borderRight: '1px solid var(--border)', paddingRight: 12, marginRight: 12 }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{matchTime}</span>
        {isLive ? (
          <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.75rem', animation: 'pulse-live 1.5s infinite' }}>{status.elapsed}'</span>
        ) : isFinished ? (
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>{status.short}</span>
        ) : (
           <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600 }}>{status.short === 'NS' ? 'Upcoming' : status.short}</span>
        )}
      </div>

      <div className="flex-grow-1 d-flex flex-column gap-2">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <img src={teams.home.logo} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} onError={(e) => e.target.style.display='none'} />
            <span style={{ fontWeight: teams.home.winner ? 700 : 500 }}>{teams.home.name}</span>
          </div>
          <span style={{ fontWeight: 700, color: goals.home > goals.away ? 'var(--accent-green)' : 'var(--text-primary)' }}>{goals.home ?? '-'}</span>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <img src={teams.away.logo} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} onError={(e) => e.target.style.display='none'} />
            <span style={{ fontWeight: teams.away.winner ? 700 : 500 }}>{teams.away.name}</span>
          </div>
          <span style={{ fontWeight: 700, color: goals.away > goals.home ? 'var(--accent-green)' : 'var(--text-primary)' }}>{goals.away ?? '-'}</span>
        </div>
      </div>
    </div>
  );
}

function LeagueDropdown({ matchesByLeague, leagueFilter, setLeagueFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allLeagues = Object.values(matchesByLeague).map(group => group.info);
  
  const filteredLeagues = allLeagues.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    (l.country && l.country.toLowerCase().includes(search.toLowerCase()))
  );

  const groupedByCountry = {};
  filteredLeagues.forEach(l => {
    const c = l.country || 'World';
    if (!groupedByCountry[c]) {
      groupedByCountry[c] = { name: c, flag: l.flag, leagues: [] };
    }
    groupedByCountry[c].leagues.push(l);
  });

  const sortedCountries = Object.keys(groupedByCountry).sort((a, b) => {
    if (a === 'World') return -1;
    if (b === 'World') return 1;
    return a.localeCompare(b);
  });

  const selectedLeague = allLeagues.find(l => l.id.toString() === leagueFilter);
  const label = selectedLeague ? (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <img src={selectedLeague.logo} alt="" style={{ width: 16, height: 16, objectFit: 'contain' }} onError={(e)=>e.target.style.display='none'} />
      {selectedLeague.name}
    </span>
  ) : (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <i className="bi bi-trophy-fill" style={{ color: 'var(--accent-green)' }}></i>
      All Leagues
    </span>
  );

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%', maxWidth: 320 }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%', background: 'var(--bg-card)', color: 'var(--text-primary)',
          border: '1px solid var(--border)', padding: '8px 16px', borderRadius: 8,
          fontSize: '0.85rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', cursor: 'pointer'
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
        <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 100, overflow: 'hidden',
          display: 'flex', flexDirection: 'column', maxHeight: 400
        }}>
          
          {/* Search Bar */}
          <div style={{ padding: 8, borderBottom: '1px solid var(--border)' }}>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-search" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.8rem' }}></i>
              <input 
                type="text" 
                placeholder="Search leagues or countries..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)',
                  border: 'none', borderRadius: 6, padding: '6px 12px 6px 32px', fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ overflowY: 'auto', padding: '4px 0' }}>
            <div 
              onClick={() => { setLeagueFilter('All'); setIsOpen(false); setSearch(''); }}
              style={{
                padding: '10px 16px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                background: leagueFilter === 'All' ? 'rgba(0,230,118,0.1)' : 'transparent',
                color: leagueFilter === 'All' ? 'var(--accent-green)' : 'var(--text-primary)',
                borderBottom: '1px solid var(--border)'
              }}
              onMouseEnter={(e) => { if(leagueFilter!=='All') e.target.style.background='rgba(255,255,255,0.05)' }}
              onMouseLeave={(e) => { if(leagueFilter!=='All') e.target.style.background='transparent' }}
            >
              <i className="bi bi-trophy-fill" style={{ marginRight: 6 }}></i> All Leagues
            </div>

            {sortedCountries.map(countryName => {
              const group = groupedByCountry[countryName];
              return (
                <div key={countryName}>
                  <div style={{ 
                    padding: '8px 16px', fontSize: '0.75rem', color: 'var(--text-muted)', 
                    fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
                    background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 8
                  }}>
                    {group.flag && <img src={group.flag} alt="" style={{ width: 14, height: 14, borderRadius: '50%', objectFit: 'cover' }} onError={(e)=>e.target.style.display='none'} />}
                    {countryName}
                  </div>
                  {group.leagues.map(l => (
                    <div 
                      key={l.id}
                      onClick={() => { setLeagueFilter(l.id.toString()); setIsOpen(false); setSearch(''); }}
                      style={{
                        padding: '8px 16px 8px 32px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8,
                        background: leagueFilter === l.id.toString() ? 'rgba(0,230,118,0.1)' : 'transparent',
                        color: leagueFilter === l.id.toString() ? 'var(--accent-green)' : 'var(--text-primary)'
                      }}
                      onMouseEnter={(e) => { if(leagueFilter!==l.id.toString()) e.currentTarget.style.background='rgba(255,255,255,0.05)' }}
                      onMouseLeave={(e) => { if(leagueFilter!==l.id.toString()) e.currentTarget.style.background='transparent' }}
                    >
                      <img src={l.logo} alt="" style={{ width: 16, height: 16, objectFit: 'contain' }} onError={(e)=>e.target.style.display='none'} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</span>
                    </div>
                  ))}
                </div>
              );
            })}
            
            {filteredLeagues.length === 0 && (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                No leagues found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MatchesPage() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [matchesByLeague, setMatchesByLeague] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All'); // All, Live, Finished, Scheduled
  const [leagueFilter, setLeagueFilter] = useState('All'); // League Filter

  useEffect(() => {
    setLoading(true);
    setError(null);
    setFilter('All'); 
    setLeagueFilter('All'); 

    FootballApiService.getFixturesByDate(selectedDate)
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        
        const grouped = {};
        arr.forEach(match => {
          const lId = match.league.id;
          if (!grouped[lId]) {
            grouped[lId] = {
              info: match.league,
              matches: []
            };
          }
          grouped[lId].matches.push(match);
        });

        Object.keys(grouped).forEach(key => {
          grouped[key].matches.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));
        });

        const popIds = [233, 39, 140, 135, 78, 61, 2];
        const sortedGrouped = {};
        Object.keys(grouped)
          .sort((a, b) => {
            const aId = parseInt(a);
            const bId = parseInt(b);
            const aPop = popIds.includes(aId);
            const bPop = popIds.includes(bId);
            if (aPop && !bPop) return -1;
            if (!aPop && bPop) return 1;
            return grouped[a].info.name.localeCompare(grouped[b].info.name);
          })
          .forEach(key => {
            sortedGrouped[key] = grouped[key];
          });

        setMatchesByLeague(sortedGrouped);
      })
      .catch((err) => {
        const msg = err.message || '';
        if (msg.includes('Free plans do not have access to this date') || msg.includes('"plan":')) {
          setError("Your free API plan only allows viewing matches for yesterday, today, and tomorrow.");
        } else {
          setError("Failed to load matches. Please try again later.");
        }
        setMatchesByLeague({});
      })
      .finally(() => setLoading(false));
  }, [selectedDate]);

  const filteredLeagues = {};
  Object.keys(matchesByLeague).forEach(lId => {
    if (leagueFilter !== 'All' && lId !== leagueFilter) return;

    const filteredMatches = matchesByLeague[lId].matches.filter(m => {
      const isLive = ['1H','2H','HT','ET','P'].includes(m.fixture.status.short);
      const isFinished = ['FT', 'AET', 'PEN'].includes(m.fixture.status.short);
      if (filter === 'Live') return isLive;
      if (filter === 'Finished') return isFinished;
      if (filter === 'Scheduled') return !isLive && !isFinished;
      return true;
    });
    
    if (filteredMatches.length > 0) {
      filteredLeagues[lId] = { ...matchesByLeague[lId], matches: filteredMatches };
    }
  });

  const totalFilteredMatches = Object.values(filteredLeagues).reduce((sum, group) => sum + group.matches.length, 0);

  return (
    <div className="page-wrapper" style={{ paddingTop: '100px', paddingBottom: '60px', paddingLeft: '24px', paddingRight: '24px', maxWidth: 800, margin: '0 auto' }}>
      
      <div className="text-center mb-4">
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>All Matches</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>View fixtures and live scores for all leagues</p>
      </div>

      <DateNav selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {/* Filters */}
      {!loading && !error && Object.keys(matchesByLeague).length > 0 && (
        <div className="d-flex flex-column align-items-center gap-3 mb-4 mt-3">
          
          <div className="d-flex justify-content-center gap-2 flex-wrap mb-2">
            {['All', 'Live', 'Finished', 'Scheduled'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? 'rgba(0,230,118,0.1)' : 'var(--bg-card)',
                  border: `1px solid ${filter === f ? 'rgba(0,230,118,0.3)' : 'var(--border)'}`,
                  color: filter === f ? 'var(--accent-green)' : 'var(--text-secondary)',
                  borderRadius: 20,
                  padding: '6px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {f === 'Live' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)', display: 'inline-block', animation: filter === 'Live' ? 'pulse-live 1.5s infinite' : 'none' }}></span>}
                {f}
              </button>
            ))}
          </div>

          <LeagueDropdown 
            matchesByLeague={matchesByLeague} 
            leagueFilter={leagueFilter} 
            setLeagueFilter={setLeagueFilter} 
          />
          
        </div>
      )}

      {loading ? (
        <div className="d-flex flex-column gap-4 mt-4">
          {[1,2,3].map(i => (
            <div key={i}>
              <div style={{ width: 150, height: 24, background: 'var(--bg-card)', borderRadius: 4, marginBottom: 12 }}></div>
              <SkeletonCard height={80} />
              <div className="mt-2"><SkeletonCard height={80} /></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="d-flex align-items-center justify-content-center gap-2 p-4 rounded-3 mt-4" style={{ background: 'rgba(248,81,73,0.07)', border: '1px solid rgba(248,81,73,0.25)', color: 'var(--loss)' }}>
          <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '1.5rem' }}></i>
          <span>{error}</span>
        </div>
      ) : Object.keys(matchesByLeague).length === 0 ? (
        <div className="text-center py-5 rounded-3 mt-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          <i className="bi bi-calendar-x d-block mb-3" style={{ fontSize: '3rem', opacity: 0.5 }}></i>
          <h4 style={{ color: 'var(--text-primary)' }}>No matches scheduled</h4>
          <p style={{ margin: 0 }}>There are no games scheduled for {selectedDate}</p>
        </div>
      ) : totalFilteredMatches === 0 ? (
        <div className="text-center py-5 rounded-3 mt-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          <i className="bi bi-filter-circle d-block mb-3" style={{ fontSize: '3rem', opacity: 0.5 }}></i>
          <h4 style={{ color: 'var(--text-primary)' }}>No {filter} matches</h4>
          <p style={{ margin: 0 }}>Try changing the filter to see more matches.</p>
        </div>
      ) : (
        <div className="mt-4">
          {Object.values(filteredLeagues).map((leagueGroup) => (
            <div key={leagueGroup.info.id} className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-3" style={{ padding: '0 8px' }}>
                <img 
                  src={leagueGroup.info.logo} 
                  alt="" 
                  style={{ width: 24, height: 24, objectFit: 'contain', background: '#fff', borderRadius: '50%', padding: 2 }} 
                  onError={(e) => e.target.style.display='none'} 
                />
                <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                  {leagueGroup.info.name}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {leagueGroup.info.country}
                </span>
              </div>

              <div className="d-flex flex-column">
                {leagueGroup.matches.map(match => (
                  <MatchRow key={match.fixture.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
