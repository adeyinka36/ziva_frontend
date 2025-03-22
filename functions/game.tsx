import axios from 'axios';
import { BASE_URL } from '@/utils/getUrls';
import { GameType } from '@/types/game';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a game
export const createGame = async (game: GameType) => {
  try {
    const response = await axios.post(`${BASE_URL}/games`, game);
    return response.data;
  } catch (error) {
    console.error('Error creating game:', error);
    throw error;
  }
};

// Retrieve all games
export const getGames = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/games`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving games:', error);
    throw error;
  }
};

// Update an existing game
export const updateGame = async (game: GameType) => {
  try {
    const response = await axios.put(`${BASE_URL}/games/${game.id}`, game);
    return response.data;
  } catch (error) {
    console.error('Error updating game:', error);
    throw error;
  }
};

// Store the current game locally (AsyncStorage)
export const storeCurrentGame = async (game: GameType) => {
  try {
    await AsyncStorage.setItem('currentGame', JSON.stringify(game));
  } catch (error) {
    console.error('Error storing current game:', error);
    throw error;
  }
};

// Retrieve the current game from local storage (AsyncStorage)
export const getCurrentGame = async (): Promise<GameType|undefined> => {
  try {
    const game = await AsyncStorage.getItem('currentGame');
    return game ? JSON.parse(game) : undefined;
  } catch (error) {
    console.error('Error getting current game:', error);
    throw error;
  }
};
