import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

const STORAGE_KEY = 'football_stats_favorites';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (type, entity) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.type === type && f.id === entity.id)) return prev;
      return [...prev, { type, ...entity }];
    });
  };

  const removeFavorite = (type, entityId) => {
    setFavorites((prev) => prev.filter((f) => !(f.type === type && f.id === entityId)));
  };

  const isFavorite = (type, entityId) => {
    return favorites.some((f) => f.type === type && f.id === entityId);
  };

  const toggleFavorite = (type, entity) => {
    if (isFavorite(type, entity.id)) {
      removeFavorite(type, entity.id);
    } else {
      addFavorite(type, entity);
    }
  };

  const getFavorites = (type) => {
    return type ? favorites.filter((f) => f.type === type) : favorites;
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite, getFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
