import { useState, useEffect, useCallback } from 'react';

interface FavoritePhrase {
  id: number;
  text: string;
  author: string;
  category: string;
  tags: string[];
  dateAdded: string;
  favoritedAt: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoritePhrase[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('spark-phrase-favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
        setFavorites([]);
      }
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('spark-phrase-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((phrase: Omit<FavoritePhrase, 'favoritedAt'>) => {
    const favoritePhrase: FavoritePhrase = {
      ...phrase,
      favoritedAt: new Date().toISOString()
    };
    
    setFavorites(prev => {
      // Check if already exists
      if (prev.some(fav => fav.id === phrase.id)) {
        return prev;
      }
      return [...prev, favoritePhrase];
    });
  }, []);

  const removeFavorite = useCallback((phraseId: number) => {
    setFavorites(prev => prev.filter(fav => fav.id !== phraseId));
  }, []);

  const isFavorite = useCallback((phraseId: number) => {
    return favorites.some(fav => fav.id === phraseId);
  }, [favorites]);

  const toggleFavorite = useCallback((phrase: Omit<FavoritePhrase, 'favoritedAt'>) => {
    if (isFavorite(phrase.id)) {
      removeFavorite(phrase.id);
      return false; // Removed
    } else {
      addFavorite(phrase);
      return true; // Added
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    favoritesCount: favorites.length
  };
};

export default useFavorites;