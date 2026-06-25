import { useState, useEffect, useRef } from 'react';
import FootballApiService from '../services/footballApiService';
import { LEAGUES, CURRENT_SEASON } from '../constants/leagues';
import { SkeletonCard } from '../components/Loader';


const COUNTRY_LEAGUE_MAP = {
  Egypt:   233,
  England:  39,
  Spain:   140,
  Italy:   135,
  Germany:  78,
  France:   61,
};

const COLORS = ['#00e676', '#58a6ff'];
const CSS_COLORS = ['var(--accent-green)', 'var(--accent-blue)'];

function StatCompareBar({ label, valA, valB, format, higherIsBetter = true }) {
  const fmt   = format ?? ((v) => (v !== null && v !== undefined ? v : '—'));
  const numA  = Number(valA) || 0;
  const numB  = Number(valB) || 0;
  const max   = Math.max(numA, numB, 1);
  const pctA  = Math.round((numA / max) * 100);
  const pctB  = Math.round((numB / max) * 100);
  const aWins = higherIsBetter ? numA > numB : numA < numB;
  const bWins = higherIsBetter ? numB > numA : numB < numA;

  return (
    <div style={{ marginBottom: 22 }}>
      <div className="d-flex align-items-center" style={{ marginBottom: 7 }}>
        <span
          style={{
            fontWeight: 700, fontSize: '1rem',
            color: aWins ? CSS_COLORS[0] : 'var(--text-primary)',
            minWidth: 44, textAlign: 'left',
          }}
        >
          {fmt(valA)}
        </span>
        <span
          style={{
            flex: 1, textAlign: 'center',
            color: 'var(--text-muted)', fontSize: '0.72rem',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontWeight: 700, fontSize: '1rem',
            color: bWins ? CSS_COLORS[1] : 'var(--text-primary)',
            minWidth: 44, textAlign: 'right',
          }}
        >
          {fmt(valB)}
        </span>
      </div>

      <div className="d-flex" style={{ gap: 3, height: 7 }}>
        <div
          style={{
            flex: 1, background: 'var(--bg-secondary)',
            borderRadius: '4px 0 0 4px', overflow: 'hidden',
            display: 'flex', justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              width: `${pctA}%`, height: '100%',
              background: aWins ? COLORS[0] : `${COLORS[0]}55`,
              borderRadius: '4px 0 0 4px',
              transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        </div>
        {/* Center divider */}
        <div style={{ width: 2, background: 'var(--border)', flexShrink: 0 }} />
        <div
          style={{
            flex: 1, background: 'var(--bg-secondary)',
            borderRadius: '0 4px 4px 0', overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${pctB}%`, height: '100%',
              background: bWins ? COLORS[1] : `${COLORS[1]}55`,
              borderRadius: '0 4px 4px 0',
              transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

function TeamSearchSlot({ slotIndex, slot, onSelect, onClear, onLeagueChange }) {
  const color    = COLORS[slotIndex];
  const cssColor = CSS_COLORS[slotIndex];
  const label    = slotIndex === 0 ? 'Select First Team' : 'Select Second Team';

  const [query,        setQuery]        = useState('');
  const [results,      setResults]      = useState([]);
  const [searching,    setSearching]    = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!slot.team) {
      setQuery('');
      setResults([]);
      setShowDropdown(false);
      setSearching(false);
    }
  }, [slot.team]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(() => {
      setSearching(true);
      FootballApiService.searchTeams(q)
        .then((data) => {
          const arr = Array.isArray(data) ? data.slice(0, 8) : [];
          setResults(arr);
          setShowDropdown(arr.length > 0);
        })
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item) => {
    onSelect(item);
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  if (!slot.team) {
    return (
      <div
        className="fs-card p-4"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 280 }}
      >
        <div
          style={{
            width: 68, height: 68, borderRadius: '50%',
            background: `${color}12`,
            border: `2px dashed ${color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 14, marginTop: 12,
          }}
        >
          <i className="bi bi-shield-plus" style={{ fontSize: '1.7rem', color: `${color}88` }} />
        </div>

        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 20, textAlign: 'center' }}>
          Type a team name to search
        </div>

        <div style={{ width: '100%', position: 'relative' }} ref={dropdownRef}>
          <div style={{ position: 'relative' }}>
            <i
              className="bi bi-search"
              style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.82rem' }}
            />
            {searching && (
              <div
                className="spinner-border"
                role="status"
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color, borderWidth: 2 }}
              >
                <span className="visually-hidden">Searching…</span>
              </div>
            )}
            <input
              type="text"
              placeholder="e.g. Liverpool, Barcelona…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = color;
                if (results.length > 0) setShowDropdown(true);
              }}
              onBlur={(e) => { e.target.style.borderColor = `${color}44`; }}
              style={{
                width: '100%', padding: '10px 14px 10px 38px',
                background: 'var(--bg-secondary)',
                border: `1px solid ${color}44`,
                borderRadius: 8,
                color: 'var(--text-primary)', fontSize: '0.875rem',
                outline: 'none', transition: 'border-color 0.2s',
              }}
            />
          </div>

          {showDropdown && results.length > 0 && (
            <div
              style={{
                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 8, boxShadow: '0 8px 28px rgba(0,0,0,0.55)',
                zIndex: 300, overflow: 'hidden',
              }}
            >
              {results.map((item) => (
                <div
                  key={item.team.id}
                  onClick={() => handleSelect(item)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', cursor: 'pointer',
                    borderBottom: '1px solid var(--border-light)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={item.team.logo}
                      alt={item.team.name}
                      style={{ width: 22, height: 22, objectFit: 'contain' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {item.team.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {item.team.country}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fs-card p-4" style={{ height: '100%' }}>

      <div className="d-flex align-items-center gap-3 mb-4">
        <div
          style={{
            width: 68, height: 68, borderRadius: '50%',
            background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            border: `3px solid ${color}44`,
          }}
        >
          <img
            src={slot.team.logo}
            alt={slot.team.name}
            style={{ width: 46, height: 46, objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 800, fontSize: '1.1rem',
              color: cssColor,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}
          >
            {slot.team.name}
          </div>
          {slot.team.country && (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
              <i className="bi bi-geo-alt-fill" style={{ color, marginRight: 4 }} />
              {slot.team.country}
            </div>
          )}
        </div>
        <button
          onClick={onClear}
          title="Change team"
          style={{
            flexShrink: 0,
            background: 'rgba(248,81,73,0.08)',
            border: '1px solid rgba(248,81,73,0.2)',
            borderRadius: 8, color: 'var(--loss)',
            cursor: 'pointer', padding: '6px 12px',
            fontSize: '0.78rem', fontWeight: 600,
          }}
        >
          <i className="bi bi-x-lg me-1" />Clear
        </button>
      </div>
      {slot.infoLoading ? (
        <div className="mb-4"><SkeletonCard height={88} /></div>
      ) : (
        slot.info && (
          <div
            className="mb-4"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}
          >
            {[
              { icon: 'bi-calendar-fill',  label: 'Founded',  value: slot.info.team?.founded    ?? 'N/A' },
              { icon: 'bi-geo-alt-fill',   label: 'Country',  value: slot.info.team?.country    ?? 'N/A' },
              { icon: 'bi-building',        label: 'Stadium',  value: slot.info.venue?.name      ?? 'N/A' },
              { icon: 'bi-people-fill',    label: 'Capacity', value: slot.info.venue?.capacity  ? slot.info.venue.capacity.toLocaleString() : 'N/A' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 8, padding: '10px 12px',
                }}
              >
                <div
                  style={{
                    fontSize: '0.68rem', color: 'var(--text-muted)',
                    marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}
                >
                  <i className={`bi ${item.icon}`} style={{ color }} />
                  {item.label}
                </div>
                <div
                  style={{
                    fontWeight: 600, fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <div>
        <label
          style={{
            fontSize: '0.7rem', color: 'var(--text-muted)',
            marginBottom: 7, display: 'flex', alignItems: 'center', gap: 5,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}
        >
          <i className="bi bi-trophy-fill" style={{ color }} />
          League for Statistics
        </label>
        <select
          value={slot.leagueId || ''}
          onChange={(e) => onLeagueChange(e.target.value)}
          style={{
            width: '100%',
            background: 'var(--bg-secondary)', color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: 8, padding: '9px 12px',
            fontSize: '0.875rem', cursor: 'pointer', outline: 'none',
          }}
          onFocus={(e) => { e.target.style.borderColor = color; }}
          onBlur={(e)  => { e.target.style.borderColor = 'var(--border)'; }}
        >
          <option value="">— Choose a league —</option>
          {LEAGUES.map((l) => (
            <option key={l.id} value={String(l.id)}>
              {l.name} ({l.country})
            </option>
          ))}
        </select>

        {slot.statsLoading && (
          <div className="mt-3"><SkeletonCard height={44} /></div>
        )}
        {!slot.statsLoading && slot.statsError && (
          <div
            className="mt-3 d-flex align-items-center gap-2"
            style={{
              background: 'rgba(248,81,73,0.07)',
              border: '1px solid rgba(248,81,73,0.2)',
              borderRadius: 8, padding: '10px 14px',
              fontSize: '0.8rem', color: 'var(--loss)',
            }}
          >
            <i className="bi bi-exclamation-triangle-fill" />
            No statistics available for this team in the selected league.
          </div>
        )}
        {!slot.statsLoading && !slot.statsError && slot.stats && (
          <div
            className="mt-3 d-flex align-items-center gap-2"
            style={{
              background: `${color}0d`,
              border: `1px solid ${color}33`,
              borderRadius: 8, padding: '10px 14px',
              fontSize: '0.8rem', color,
            }}
          >
            <i className="bi bi-check-circle-fill" />
            Stats loaded for <strong style={{ marginLeft: 3 }}>{slot.stats.league?.name || 'the selected league'}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

function ComparisonSection({ slotA, slotB }) {
  const sA = slotA.stats;
  const sB = slotB.stats;

  if (!sA || !sB) {
    return (
      <div
        className="fs-card p-5 text-center mt-4"
        style={{ border: '1px dashed var(--border)' }}
      >
        <i
          className="bi bi-bar-chart-fill"
          style={{ fontSize: '2.8rem', color: 'rgba(0,230,118,0.25)', display: 'block', marginBottom: 14 }}
        />
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Select a <strong>league for both teams</strong> to unlock the full comparison.
        </p>
      </div>
    );
  }

  const saf = (obj, ...keys) =>
    keys.reduce((o, k) => (o != null && o[k] !== undefined ? o[k] : null), obj);

  const playedA  = saf(sA, 'fixtures', 'played', 'total') || 0;
  const winsA    = saf(sA, 'fixtures', 'wins',   'total') || 0;
  const playedB  = saf(sB, 'fixtures', 'played', 'total') || 0;
  const winsB    = saf(sB, 'fixtures', 'wins',   'total') || 0;
  const winRateA = playedA > 0 ? Math.round((winsA / playedA) * 100) : 0;
  const winRateB = playedB > 0 ? Math.round((winsB / playedB) * 100) : 0;

  const STATS = [
    {
      label: 'Matches Played',
      valA:  saf(sA, 'fixtures', 'played', 'total'),
      valB:  saf(sB, 'fixtures', 'played', 'total'),
    },
    {
      label: 'Wins',
      valA:  winsA,
      valB:  winsB,
    },
    {
      label: 'Draws',
      valA:  saf(sA, 'fixtures', 'draws', 'total'),
      valB:  saf(sB, 'fixtures', 'draws', 'total'),
    },
    {
      label: 'Losses',
      valA:  saf(sA, 'fixtures', 'loses', 'total'),
      valB:  saf(sB, 'fixtures', 'loses', 'total'),
      higherIsBetter: false,
    },
    {
      label: 'Goals Scored',
      valA:  saf(sA, 'goals', 'for',     'total', 'total'),
      valB:  saf(sB, 'goals', 'for',     'total', 'total'),
    },
    {
      label: 'Goals Conceded',
      valA:  saf(sA, 'goals', 'against', 'total', 'total'),
      valB:  saf(sB, 'goals', 'against', 'total', 'total'),
      higherIsBetter: false,
    },
    {
      label:  'Goals / Game',
      valA:   saf(sA, 'goals', 'for', 'average', 'total'),
      valB:   saf(sB, 'goals', 'for', 'average', 'total'),
      format: (v) => (v !== null && v !== undefined ? Number(v).toFixed(1) : '—'),
    },
    {
      label: 'Clean Sheets',
      valA:  saf(sA, 'clean_sheet', 'total'),
      valB:  saf(sB, 'clean_sheet', 'total'),
    },
    {
      label: 'Home Wins',
      valA:  saf(sA, 'fixtures', 'wins', 'home'),
      valB:  saf(sB, 'fixtures', 'wins', 'home'),
    },
    {
      label: 'Away Wins',
      valA:  saf(sA, 'fixtures', 'wins', 'away'),
      valB:  saf(sB, 'fixtures', 'wins', 'away'),
    },
    {
      label: 'Failed to Score',
      valA:  saf(sA, 'failed_to_score', 'total'),
      valB:  saf(sB, 'failed_to_score', 'total'),
      higherIsBetter: false,
    },
  ].filter((s) => s.valA !== null || s.valB !== null);

  return (
    <div className="fs-card p-4 mt-4">
      <div
        className="d-flex align-items-center justify-content-between mb-4 pb-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="d-flex align-items-center gap-2">
          <img
            src={slotA.team?.logo} alt=""
            style={{ width: 26, height: 26, objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span style={{ fontWeight: 700, color: CSS_COLORS[0], fontSize: '0.9rem' }}>
            {slotA.team?.name}
          </span>
        </div>
        <span
          style={{
            fontWeight: 700, fontSize: '0.68rem',
            color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase',
          }}
        >
          Statistics
        </span>
        <div className="d-flex align-items-center gap-2">
          <span style={{ fontWeight: 700, color: CSS_COLORS[1], fontSize: '0.9rem' }}>
            {slotB.team?.name}
          </span>
          <img
            src={slotB.team?.logo} alt=""
            style={{ width: 26, height: 26, objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      </div>

      <div
        className="d-flex align-items-center justify-content-between mb-4 p-3"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-light)',
          borderRadius: 10,
        }}
      >
        <div className="text-center" style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '2.4rem', fontWeight: 800,
              color: winRateA > winRateB ? CSS_COLORS[0] : 'var(--text-primary)',
              lineHeight: 1,
            }}
          >
            {winRateA}%
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Win Rate
          </div>
        </div>

        <div
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '0.75rem',
            color: 'var(--text-muted)', letterSpacing: '0.04em',
          }}
        >
          VS
        </div>

        <div className="text-center" style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '2.4rem', fontWeight: 800,
              color: winRateB > winRateA ? CSS_COLORS[1] : 'var(--text-primary)',
              lineHeight: 1,
            }}
          >
            {winRateB}%
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Win Rate
          </div>
        </div>
      </div>

      {STATS.map((s) => (
        <StatCompareBar
          key={s.label}
          label={s.label}
          valA={s.valA ?? 0}
          valB={s.valB ?? 0}
          format={s.format}
          higherIsBetter={s.higherIsBetter}
        />
      ))}
    </div>
  );
}


const DEFAULT_SLOT = {
  team:         null, 
  info:         null, 
  infoLoading:  false,
  stats:        null,   
  statsLoading: false,
  statsError:   false,
  leagueId:     '',    
};

export default function ComparePage() {
  const [slotA, setSlotA] = useState({ ...DEFAULT_SLOT });
  const [slotB, setSlotB] = useState({ ...DEFAULT_SLOT });

  /* Generic updater — merges partial state into the chosen slot */
  const updateSlot = (idx, updates) => {
    if (idx === 0) setSlotA((prev) => ({ ...prev, ...updates }));
    else           setSlotB((prev) => ({ ...prev, ...updates }));
  };
  const getSlot = (idx) => (idx === 0 ? slotA : slotB);

  const handleSelect = (slotIdx, item) => {
    const teamData = {
      id:      item.team.id,
      name:    item.team.name,
      logo:    item.team.logo,
      country: item.team.country,
    };
    const autoLeagueId = String(COUNTRY_LEAGUE_MAP[item.team.country] || '');

    updateSlot(slotIdx, {
      team:         teamData,
      info:         null,
      infoLoading:  true,
      stats:        null,
      statsLoading: !!autoLeagueId,
      statsError:   false,
      leagueId:     autoLeagueId,
    });

    FootballApiService.getTeamInfo(item.team.id)
      .then((data) => {
        const teamInfo = Array.isArray(data) && data.length > 0 ? data[0] : null;
        updateSlot(slotIdx, { info: teamInfo, infoLoading: false });
      })
      .catch(() => updateSlot(slotIdx, { infoLoading: false }));

    if (autoLeagueId) {
      FootballApiService.getTeamStats(item.team.id, autoLeagueId, CURRENT_SEASON)
        .then((data) => {
          updateSlot(slotIdx, {
            stats:        data || null,
            statsLoading: false,
            statsError:   !data,
          });
        })
        .catch(() => updateSlot(slotIdx, { stats: null, statsLoading: false, statsError: true }));
    }
  };

  const handleClear = (slotIdx) => {
    updateSlot(slotIdx, { ...DEFAULT_SLOT });
  };

  const handleLeagueChange = (slotIdx, leagueId) => {
    if (!leagueId) {
      updateSlot(slotIdx, { leagueId: '', stats: null, statsError: false });
      return;
    }
    const slot = getSlot(slotIdx);
    if (!slot.team) return;

    updateSlot(slotIdx, { leagueId, stats: null, statsLoading: true, statsError: false });

    FootballApiService.getTeamStats(slot.team.id, leagueId, CURRENT_SEASON)
      .then((data) => {
        updateSlot(slotIdx, {
          stats:        data || null,
          statsLoading: false,
          statsError:   !data,
        });
      })
      .catch(() => updateSlot(slotIdx, { stats: null, statsLoading: false, statsError: true }));
  };

  const bothSelected = slotA.team && slotB.team;

  return (
    <div className="page-wrapper">
      <section
        style={{
          padding: '56px 24px 44px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(88,166,255,0.07) 0%, transparent 100%)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div
            style={{
              width: 68, height: 68, borderRadius: '50%',
              background: 'rgba(88,166,255,0.1)',
              border: '1px solid rgba(88,166,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px',
            }}
          >
            <i className="bi bi-bar-chart-fill" style={{ fontSize: '1.8rem', color: 'var(--accent-blue)' }} />
          </div>

          <h1 style={{ fontSize: 'clamp(1.9rem, 5vw, 2.8rem)', fontWeight: 800, marginBottom: 10 }}>
            Compare Teams
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 auto', maxWidth: 480 }}>
            Search for two teams, choose a league for each, and see a full side-by-side breakdown.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px' }}>

        <div className="row g-4 align-items-start">

          <div className="col-12 col-lg-5">
            <div
              style={{
                fontSize: '0.68rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.12em',
                color: CSS_COLORS[0], marginBottom: 8,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <i className="bi bi-shield-fill" />
              Team A
            </div>
            <TeamSearchSlot
              slotIndex={0}
              slot={slotA}
              onSelect={(item)     => handleSelect(0, item)}
              onClear={() => handleClear(0)}
              onLeagueChange={(id) => handleLeagueChange(0, id)}
            />
          </div>

          <div className="col-12 col-lg-2 d-flex align-items-center justify-content-center" style={{ paddingTop: '2.5rem' }}>
            <div
              style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(0,230,118,0.08), rgba(88,166,255,0.08))',
                border: '2px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.88rem',
                color: 'var(--text-muted)', letterSpacing: '0.06em',
              }}
            >
              VS
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div
              style={{
                fontSize: '0.68rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.12em',
                color: CSS_COLORS[1], marginBottom: 8,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <i className="bi bi-shield-fill" />
              Team B
            </div>
            <TeamSearchSlot
              slotIndex={1}
              slot={slotB}
              onSelect={(item)     => handleSelect(1, item)}
              onClear={() => handleClear(1)}
              onLeagueChange={(id) => handleLeagueChange(1, id)}
            />
          </div>
        </div>

        <ComparisonSection slotA={slotA} slotB={slotB} />

        {!bothSelected && (
          <p
            className="text-center mt-4"
            style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}
          >
            <i className="bi bi-info-circle me-2" />
            Search and select two teams above to compare their statistics.
          </p>
        )}
      </div>
    </div>
  );
}
