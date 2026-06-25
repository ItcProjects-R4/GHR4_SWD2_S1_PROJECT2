import ApiService from './apiService';
import { CURRENT_SEASON } from '../constants/leagues';

const FootballApiService = {
  /* ── Fixtures ── */
  getTodayFixtures() {
    const today = new Date().toISOString().split('T')[0];
    return this.getFixturesByDate(today);
  },

  getFixturesByDate(date) {
    return ApiService.get('/fixtures', { date }, `fixtures_v2_${date}`);
  },

  getLiveFixtures() {
    return ApiService.get('/fixtures', { live: 'all' }, null);
  },

  getFixtureDetails(id) {
    return ApiService.get('/fixtures', { id }, `fixture_${id}`);
  },

  getFixtureEvents(id) {
    return ApiService.get('/fixtures/events', { fixture: id }, `events_${id}`);
  },

  getFixtureStats(id) {
    return ApiService.get('/fixtures/statistics', { fixture: id }, `stats_${id}`);
  },

  getFixtureLineups(id) {
    return ApiService.get('/fixtures/lineups', { fixture: id }, `lineups_${id}`);
  },

  getH2H(t1, t2) {
    return ApiService.get('/fixtures/headtohead', { h2h: `${t1}-${t2}` }, `h2h_${t1}_${t2}`);
  },

  /* ── Leagues ── */
  getStandings(leagueId, season = CURRENT_SEASON) {
    return ApiService.get('/standings', { league: leagueId, season }, `standings_${leagueId}_${season}`);
  },

  getLeagueFixtures(leagueId, season = CURRENT_SEASON) {
    return ApiService.get('/fixtures', { league: leagueId, season }, `league_fixtures_${leagueId}_${season}`);
  },

  getTopScorers(leagueId, season = CURRENT_SEASON) {
    return ApiService.get('/players/topscorers', { league: leagueId, season }, `scorers_${leagueId}_${season}`);
  },

  getTopAssists(leagueId, season = CURRENT_SEASON) {
    return ApiService.get('/players/topassists', { league: leagueId, season }, `assists_${leagueId}_${season}`);
  },

  /* ── Teams ── */
  getTeamInfo(teamId) {
    return ApiService.get('/teams', { id: teamId }, `team_${teamId}`);
  },

  getTeamSquad(teamId) {
    return ApiService.get('/players/squads', { team: teamId }, `squad_${teamId}`);
  },

  getTeamStats(teamId, leagueId, season = CURRENT_SEASON) {
    return ApiService.get('/teams/statistics', { team: teamId, league: leagueId, season }, `teamstats_${teamId}_${leagueId}`);
  },

  getTeamFixtures(teamId, season = CURRENT_SEASON, last = 10) {
    return ApiService.get('/fixtures', { team: teamId, season, last }, `team_fix_${teamId}_${last}`);
  },

  /* ── Players ── */
  getPlayer(playerId, season = CURRENT_SEASON) {
    return ApiService.get('/players', { id: playerId, season }, `player_${playerId}_${season}`);
  },

  /* ── Search ── */
  searchTeams(q) {
    return ApiService.get('/teams', { search: q }, `search_t_${q}`).catch((err) => {
      console.warn('Search API failed, using demo data', err);
      if (q.toLowerCase().includes('liv')) {
        return [{ team: { id: 40, name: 'Liverpool', country: 'England', founded: 1892, logo: 'https://media.api-sports.io/football/teams/40.png' }, venue: { name: 'Anfield' } }];
      }
      return [];
    });
  },

  searchPlayers(q) {
    return ApiService.get('/players', { search: q }, `search_p_${q}`).catch((err) => {
      console.warn('Search API failed, using demo data', err);
      if (q.toLowerCase().includes('sal')) {
        return [{ player: { id: 306, firstname: 'Mohamed', lastname: 'Salah', name: 'M. Salah', age: 31, nationality: 'Egypt', photo: 'https://media.api-sports.io/football/players/306.png' } }];
      }
      if (q.toLowerCase().includes('alis')) {
        return [{ player: { id: 280, firstname: 'Alisson', lastname: 'Becker', name: 'Alisson', age: 31, nationality: 'Brazil', photo: 'https://media.api-sports.io/football/players/280.png' } }];
      }
      return [];
    });
  },
};

export default FootballApiService;
