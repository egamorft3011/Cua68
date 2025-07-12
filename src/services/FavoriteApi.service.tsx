// services/FavoriteApi.service.js

/**
 * API service for handling favorite games
 */

import { contentInstance } from "@/configs/CustomizeAxios";

// Get list of favorite games
export const getListFavorites = async () => {
  try {
    const response = await contentInstance.get('/api/product/favorites');
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error :any) {
    console.error('Error fetching favorites:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

// Add game to favorites
export const addToFavorites = async (gameId :string , category  :string) => {
  try {
    const response = await contentInstance.post('/api/product/favorites/add', {
      gameId: gameId,
      category: category, // chess, rng, fish
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error :any) {
    console.error('Error adding to favorites:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

// Remove game from favorites
export const removeFromFavorites = async (gameId :string , category  :string) => {
  try {
    const response = await contentInstance.post('/api/product/favorites/remove', {
      gameId: gameId,
      category: category, // chess, rng, fish
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error :any) {
    console.error('Error removing from favorites:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

// Helper function to determine category based on game data
export const getGameCategory = (gameData : any) => {
  // You can customize this logic based on your game data structure
  if (gameData.product === 'FISH' || gameData.gameType === 'fish') {
    return 'fish';
  } else if (gameData.product === 'CHESS' || gameData.gameType === 'chess') {
    return 'chess';
  } else if (gameData.product === 'RNG' || gameData.gameType === 'rng') {
    return 'rng';
  }
  
  // Default fallback - you might want to adjust this
  return 'fish';
};