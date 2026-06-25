export const LEAGUES = [
  {
    id: 233,
    name: 'Egyptian Premier League',
    shortName: 'EPL',
    country: 'Egypt',
    flag: 'EG',
    logo: '/logos/league_233.png',
    season: 2025,
  },
  {
    id: 39,
    name: 'Premier League',
    shortName: 'PL',
    country: 'England',
    flag: 'GB',
    logo: '/logos/league_39.png',
    season: 2025,
  },
  {
    id: 140,
    name: 'La Liga',
    shortName: 'LaLiga',
    country: 'Spain',
    flag: 'ES',
    logo: '/logos/league_140.png',
    season: 2025,
  },
  {
    id: 135,
    name: 'Serie A',
    shortName: 'Serie A',
    country: 'Italy',
    flag: 'IT',
    logo: '/logos/league_135.png',
    season: 2025,
  },
  {
    id: 78,
    name: 'Bundesliga',
    shortName: 'BL',
    country: 'Germany',
    flag: 'DE',
    logo: '/logos/league_78.png',
    season: 2025,
  },
  {
    id: 61,
    name: 'Ligue 1',
    shortName: 'L1',
    country: 'France',
    flag: 'FR',
    logo: '/logos/league_61.png',
    season: 2025,
  },
  {
    id: 2,
    name: 'Champions League',
    shortName: 'UCL',
    country: 'Europe',
    flag: 'EU',
    logo: '/logos/league_2.png',
    season: 2025,
  },
];

export const LEAGUE_MAP = Object.fromEntries(LEAGUES.map((l) => [l.id, l]));

export const CURRENT_SEASON = 2025;

export const MORE_LEAGUES = [
  { id: 94,  name: 'Primeira Liga',       country: 'Portugal',     logo: 'https://media.api-sports.io/football/leagues/94.png',  flag: 'https://media.api-sports.io/flags/pt.svg' },
  { id: 88,  name: 'Eredivisie',          country: 'Netherlands',  logo: 'https://media.api-sports.io/football/leagues/88.png',  flag: 'https://media.api-sports.io/flags/nl.svg' },
  { id: 203, name: 'Super Lig',           country: 'Turkey',       logo: 'https://media.api-sports.io/football/leagues/203.png', flag: 'https://media.api-sports.io/flags/tr.svg' },
  { id: 144, name: 'Belgian Pro League',   country: 'Belgium',      logo: 'https://media.api-sports.io/football/leagues/144.png', flag: 'https://media.api-sports.io/flags/be.svg' },
  { id: 253, name: 'MLS',                 country: 'USA',          logo: 'https://media.api-sports.io/football/leagues/253.png', flag: 'https://media.api-sports.io/flags/us.svg' },
  { id: 307, name: 'Saudi Pro League',    country: 'Saudi Arabia', logo: 'https://media.api-sports.io/football/leagues/307.png', flag: 'https://media.api-sports.io/flags/sa.svg' },
  { id: 71,  name: 'Serie A',             country: 'Brazil',       logo: 'https://media.api-sports.io/football/leagues/71.png',  flag: 'https://media.api-sports.io/flags/br.svg' },
  { id: 128, name: 'Liga Profesional',    country: 'Argentina',    logo: 'https://media.api-sports.io/football/leagues/128.png', flag: 'https://media.api-sports.io/flags/ar.svg' },
  { id: 3,   name: 'Europa League',       country: 'Europe',       logo: 'https://media.api-sports.io/football/leagues/3.png',   flag: 'https://media.api-sports.io/flags/eu.svg' },
  { id: 848, name: 'Conference League',   country: 'Europe',       logo: 'https://media.api-sports.io/football/leagues/848.png', flag: 'https://media.api-sports.io/flags/eu.svg' },
  { id: 1,   name: 'World Cup',           country: 'World',        logo: 'https://media.api-sports.io/football/leagues/1.png',   flag: null },
  { id: 4,   name: 'Euro Championship',   country: 'Europe',       logo: 'https://media.api-sports.io/football/leagues/4.png',   flag: 'https://media.api-sports.io/flags/eu.svg' },
  { id: 15,  name: 'FIFA Club World Cup', country: 'World',        logo: 'https://media.api-sports.io/football/leagues/15.png',  flag: null },
  { id: 45,  name: 'FA Cup',              country: 'England',      logo: 'https://media.api-sports.io/football/leagues/45.png',  flag: 'https://media.api-sports.io/flags/gb.svg' },
  { id: 143, name: 'Copa del Rey',        country: 'Spain',        logo: 'https://media.api-sports.io/football/leagues/143.png', flag: 'https://media.api-sports.io/flags/es.svg' },
  { id: 137, name: 'Coppa Italia',        country: 'Italy',        logo: 'https://media.api-sports.io/football/leagues/137.png', flag: 'https://media.api-sports.io/flags/it.svg' },
  { id: 528, name: 'Community Shield',    country: 'England',      logo: 'https://media.api-sports.io/football/leagues/528.png', flag: 'https://media.api-sports.io/flags/gb.svg' },
  { id: 556, name: 'Super Cup',           country: 'Europe',       logo: 'https://media.api-sports.io/football/leagues/556.png', flag: 'https://media.api-sports.io/flags/eu.svg' },
];

export const ALL_LEAGUES = [
  ...LEAGUES.map(l => ({
    ...l,
    flag: l.flag ? `https://media.api-sports.io/flags/${l.flag.toLowerCase()}.svg` : null,
  })),
  ...MORE_LEAGUES.filter(ml => !LEAGUES.some(l => l.id === ml.id)),
];

export const ALL_LEAGUES_MAP = Object.fromEntries(ALL_LEAGUES.map(l => [l.id, l]));
