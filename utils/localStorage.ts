// utils/localStorage.ts

import {Team} from "../data/teams";

// Keys for local storage
const TEAMS_KEY = "teams";
const GUESSED_SONGS_KEY = "guessedSongs";

// Function to get guessed songs from local storage
export const getGuessedSongsFromLocalStorage = (): number[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(GUESSED_SONGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error getting guessed songs from local storage:", error);
    return [];
  }
};

// Function to save guessed songs to local storage
export const saveGuessedSongsToLocalStorage = (
  guessedSongIds: number[]
): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUESSED_SONGS_KEY, JSON.stringify(guessedSongIds));
  } catch (error) {
    console.error("Error saving guessed songs to local storage:", error);
  }
};

// Function to get teams from local storage
export const getTeamsFromLocalStorage = (): Team[] | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(TEAMS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error getting teams from local storage:", error);
    return null;
  }
};

// Function to save teams to local storage
export const saveTeamsToLocalStorage = (teams: Team[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
  } catch (error) {
    console.error("Error saving teams to local storage:", error);
  }
};
