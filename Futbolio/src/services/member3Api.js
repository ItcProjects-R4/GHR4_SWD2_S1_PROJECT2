import ApiService from './apiService';

export const LEAGUES = {
  39:  { name: 'Premier League',   country: 'England',  flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  140: { name: 'La Liga',          country: 'Spain',    flag: '🇪🇸' },
  135: { name: 'Serie A',          country: 'Italy',    flag: '🇮🇹' },
  78:  { name: 'Bundesliga',       country: 'Germany',  flag: '🇩🇪' },
  61:  { name: 'Ligue 1',          country: 'France',   flag: '🇫🇷' },
  2:   { name: 'Champions League', country: 'Europe',   flag: '🇪🇺' },
  3:   { name: 'Europa League',    country: 'Europe',   flag: '🇪🇺' },
  848: { name: 'Conference League',country: 'Europe',   flag: '🇪🇺' },
  1:   { name: 'World Cup',        country: 'World',    flag: '🌍' },
};

async function get(endpoint) {
  return await ApiService.get(endpoint, {}, `m3_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}`);
}

export const api = {
 
  async fetchStandings(leagueId = 39, season = 2024) {
    const data = await get(`/standings?league=${leagueId}&season=${season}`);
    if (!data || !data[0]?.league?.standings?.[0]) return [];
    return data[0].league.standings[0];
  },

 
  async fetchRecentLeagueMatches(leagueId = 39, season = 2024) {
    const data = await get(
      `/fixtures?league=${leagueId}&season=${season}&status=FT&last=10`
    );
    return (data || []).map(f => ({
      id: f.fixture.id,
      date: new Date(f.fixture.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      homeTeam: f.teams.home.name,
      awayTeam: f.teams.away.name,
      homeLogo: f.teams.home.logo,
      awayLogo: f.teams.away.logo,
      homeScore: f.goals.home,
      awayScore: f.goals.away,
    }));
  },

  
  async fetchTopScorers(leagueId = 39, season = 2024) {
    const data = await get(`/players/topscorers?league=${leagueId}&season=${season}`);
    return data || [];
  },

 
  async fetchTopAssists(leagueId = 39, season = 2024) {
    const data = await get(`/players/topassists?league=${leagueId}&season=${season}`);
    return data || [];
  },


  async fetchTeamProfile(teamId, leagueId = 39, season = 2024) {
    const [teamRes, statsRes, fixturesRes, playersRes] = await Promise.all([
      get(`/teams?id=${teamId}`),
      get(`/teams/statistics?team=${teamId}&league=${leagueId}&season=${season}`),
      get(`/fixtures?team=${teamId}&league=${leagueId}&season=${season}&status=FT&last=7`),
      get(`/players?team=${teamId}&league=${leagueId}&season=${season}&page=1`),
    ]);

    const teamInfo  = teamRes?.[0];
    const stats     = statsRes?.[0] ?? statsRes;
    const fixtures  = fixturesRes || [];
    const players   = playersRes || [];

    if (!teamInfo) throw new Error('Team not found');

    const squad = { forwards: [], midfielders: [], defenders: [], goalkeepers: [] };
    players.forEach(({ player, statistics }) => {
      const pos = statistics?.[0]?.games?.position || 'Midfielder';
      const entry = {
        id: player.id.toString(),
        name: player.name,
        number: statistics?.[0]?.games?.number ?? '–',
        age: player.age,
        photo: player.photo,
        flag: player.nationality,
      };
      if (pos === 'Attacker')   squad.forwards.push(entry);
      else if (pos === 'Midfielder') squad.midfielders.push(entry);
      else if (pos === 'Defender')   squad.defenders.push(entry);
      else                           squad.goalkeepers.push(entry);
    });

    const recentMatches = fixtures.map(f => {
      const isHome = f.teams.home.id.toString() === teamId.toString();
      const myScore = isHome ? f.goals.home : f.goals.away;
      const oppScore = isHome ? f.goals.away : f.goals.home;
      let outcome = myScore > oppScore ? 'w' : myScore < oppScore ? 'l' : 'd';
      return {
        id: f.fixture.id,
        date: new Date(f.fixture.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        competition: f.league.name,
        homeAway: isHome ? 'H' : 'A',
        opponent: isHome ? f.teams.away.name : f.teams.home.name,
        score: `${f.goals.home} - ${f.goals.away}`,
        outcome,
      };
    });

    const formStr = recentMatches.map(m => m.outcome.toUpperCase()).join('');
    const formBubbles = recentMatches.map(m => ({ result: m.outcome, comp: m.competition }));
    const wins = recentMatches.filter(m => m.outcome === 'w').length;
    const statusText = wins >= 4 ? 'Excellent Form' : wins >= 2 ? 'Good Form' : 'Poor Form';

    const goalsByMinute = Object.entries(stats?.goals?.for?.minute || {}).map(([k, v]) => ({
      minute: k,
      GoalsFor: v?.total ?? 0,
      GoalsAgainst: stats?.goals?.against?.minute?.[k]?.total ?? 0,
    }));

    const lineups = (stats?.lineups || []).map(l => ({ formation: l.formation, played: l.played }));
    const csd = stats?.clean_sheet || {};
    const pen = stats?.penalty?.scored || {};

    return {
      id: teamInfo.team.id,
      name: teamInfo.team.name,
      logo: teamInfo.team.logo,
      founded: teamInfo.team.founded,
      stadium: teamInfo.venue?.name,
      stadiumCity: teamInfo.venue?.city,
      stadiumCapacity: teamInfo.venue?.capacity?.toLocaleString(),
      stadiumImage: teamInfo.venue?.image,
      coachFigma: stats?.coach || '–',
      stats: {
        matches:      stats?.fixtures?.played?.total ?? 0,
        goalsFor:     stats?.goals?.for?.total?.total ?? 0,
        goalsAgainst: stats?.goals?.against?.total?.total ?? 0,
        cleanSheets:  (csd.home ?? 0) + (csd.away ?? 0),
      },
      form: { bubbles: formBubbles, statusText },
      recentMatches,
      goalsByMinute,
      lineups,
      cleanSheetsDetail: { home: csd.home ?? 0, away: csd.away ?? 0 },
      penalties: { scored: pen.total ?? 0, total: (pen.total ?? 0) + (stats?.penalty?.missed?.total?.total ?? 0) },
      squad,
    };
  },


  async fetchPlayerProfile(playerId, season = 2024) {
    const data = await get(`/players?id=${playerId}&season=${season}`);
    const item = data?.[0];
    if (!item) throw new Error('Player not found');

    const { player, statistics } = item;
    const s = statistics?.[0] || {};
    const g = s.goals || {};
    const sh = s.shots || {};
    const ps = s.passes || {};
    const dr = s.dribbles || {};
    const du = s.duels || {};
    const tk = s.tackles || {};
    const cr = s.cards || {};
    const gk = s.goalkeeper || {};
    const pn = s.penalty || {};
    const fo = s.fouls || {};

    const historyRaw = await get(`/players?id=${playerId}&season=2023`).catch(() => []);
    const hist2023 = historyRaw?.[0]?.statistics?.[0];

    const seasonHistory = [
      { season: '23/24', goals: hist2023?.goals?.total ?? 0, assists: hist2023?.goals?.assists ?? 0 },
      { season: '24/25', goals: g.total ?? 0,               assists: g.assists ?? 0 },
    ];

    const goals  = g.total ?? 0;
    const passes = ps.accuracy ?? 50;
    const drib   = dr.success ?? 0;
    const tackle = tk.total ?? 0;
    const shots  = sh.on ?? 0;
    const mins   = s.games?.minutes ?? 90;
    const max    = (v, m) => Math.min(100, Math.round((v / m) * 100));

    const radarStats = [
      { subject: 'Finishing',   A: max(goals,  20) },
      { subject: 'Passing',     A: Math.min(100, passes) },
      { subject: 'Dribbling',   A: max(drib,   50) },
      { subject: 'Defending',   A: max(tackle, 60) },
      { subject: 'Shooting',    A: max(shots,  40) },
      { subject: 'Work Rate',   A: max(mins,   2500) },
    ];

    return {
      id: player.id.toString(),
      name: player.name,
      fullname: player.firstname + ' ' + player.lastname,
      photo: player.photo,
      age: player.age,
      birthDate: player.birth?.date,
      birthPlace: player.birth?.place,
      birthCountry: player.birth?.country,
      nationality: player.nationality,
      height: player.height ?? '–',
      weight: player.weight ?? '–',
      number: s.games?.number ?? '–',
      position: s.games?.position ?? '–',
      teamName: s.team?.name ?? '–',
      radarStats,
      seasonHistory,
      detailedStats: {
        appearances:       s.games?.appearences ?? 0,
        lineups:           s.games?.lineups ?? 0,
        minutesPlayed:     s.games?.minutes ?? 0,
        rating:            s.games?.rating ? parseFloat(s.games.rating).toFixed(1) : '–',
        goals:             g.total ?? 0,
        assists:           g.assists ?? 0,
        shotsTotal:        sh.total ?? 0,
        shotsOnTarget:     sh.on ?? 0,
        passesTotal:       ps.total ?? 0,
        keyPasses:         ps.key ?? 0,
        passAccuracy:      ps.accuracy ? `${ps.accuracy}%` : '–',
        dribblesCompleted: dr.success ?? 0,
        dribbleAttempts:   dr.attempts ?? 0,
        tackles:           tk.total ?? 0,
        interceptions:     tk.interceptions ?? 0,
        blocks:            tk.blocks ?? 0,
        duelsWon:          du.won ?? 0,
        duelsTotal:        du.total ?? 0,
        foulsDrawn:        fo.drawn ?? 0,
        foulsCommitted:    fo.committed ?? 0,
        yellowCards:       cr.yellow ?? 0,
        redCards:          cr.red ?? 0,
        penaltiesScored:   pn.scored ?? 0,
        penaltiesMissed:   pn.missed ?? 0,
        cleanSheets:       gk.clean_sheet ?? 0,
        savesMade:         gk.saves ?? 0,
        goalsConceded:     gk.goals_conceded ?? 0,
        savePercentage:    gk.saves && gk.goals_conceded
          ? `${Math.round((gk.saves / (gk.saves + gk.goals_conceded)) * 100)}%`
          : '–',
      },
    };
  },
};
