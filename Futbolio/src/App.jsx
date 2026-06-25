import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import HomePage from './pages/HomePage';
import MatchesPage from './pages/MatchesPage';
import LeaguesListPage from './pages/LeaguesListPage';
import LeaguePage from './pages/LeaguePage';
import MatchDetailsPage from './pages/MatchDetailsPage';
import SearchPage from './pages/SearchPage';
import TeamPage from './pages/TeamPage';
import PlayerPage from './pages/PlayerPage';
import FavoritesPage from './pages/FavoritesPage';
import ComparePage   from './pages/ComparePage';

function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <Navbar />
        <Chatbot />
        <Routes>
          <Route path="/"                  element={<HomePage />} />
          <Route path="/matches"           element={<MatchesPage />} />
          <Route path="/leagues"           element={<LeaguesListPage />} />
          <Route path="/league/:leagueId"  element={<LeaguePage />} />
          <Route path="/match/:fixtureId"  element={<MatchDetailsPage />} />
          <Route path="/team/:id"          element={<TeamPage />} />
          <Route path="/player/:id"        element={<PlayerPage />} />
          <Route path="/compare"           element={<ComparePage />} />
          <Route path="/search"            element={<SearchPage />} />
          <Route path="/favorites"         element={<FavoritesPage />} />
        </Routes>
        <Footer />
      </FavoritesProvider>
    </BrowserRouter>
  );
}

export default App;
