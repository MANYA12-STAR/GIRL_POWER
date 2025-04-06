// Utility functions for tracking and managing screen time

// Sample game usage data - in a real app, this would be stored in a database or local storage
let gameUsageData = [
  { id: 1, title: "A tale of disappearing prince", timeSpent: 45, category: "Games", lastPlayed: new Date().toISOString() },
  { id: 2, title: "The magical forest adventure", timeSpent: 30, category: "Learning", lastPlayed: new Date().toISOString() },
  { id: 3, title: "Space explorers and aliens", timeSpent: 15, category: "Games", lastPlayed: new Date().toISOString() },
  { id: 4, title: "Underwater treasure hunt", timeSpent: 10, category: "Learning", lastPlayed: new Date().toISOString() },
  { id: 5, title: "Dinosaur time travel", timeSpent: 5, category: "Games", lastPlayed: new Date().toISOString() },
  { id: 6, title: "Robot friends forever", timeSpent: 0, category: "Learning", lastPlayed: null }
];

// Track when a game is clicked/played
let gameStartTimes = {};

// Daily screen time limit in minutes
const DAILY_SCREEN_TIME_LIMIT = 180; // 3 hours

/**
 * Get the total screen time across all games
 * @returns {number} Total time in minutes
 */
export const getTotalScreenTime = () => {
  return gameUsageData.reduce((total, game) => total + game.timeSpent, 0);
};

/**
 * Get screen time by category
 * @returns {Object} Object with category names as keys and time in minutes as values
 */
export const getScreenTimeByCategory = () => {
  const categories = {};
  
  gameUsageData.forEach(game => {
    if (!categories[game.category]) {
      categories[game.category] = 0;
    }
    categories[game.category] += game.timeSpent;
  });
  
  return categories;
};

/**
 * Format minutes into hours and minutes string (e.g., "1h 45m")
 * @param {number} minutes - Time in minutes
 * @returns {string} Formatted time string
 */
export const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

/**
 * Calculate the percentage of screen time used relative to the daily limit
 * @returns {number} Percentage (0-100)
 */
export const getScreenTimePercentage = () => {
  const totalTime = getTotalScreenTime();
  return Math.min(Math.round((totalTime / DAILY_SCREEN_TIME_LIMIT) * 100), 100);
};

/**
 * Start tracking time for a game when it's clicked
 * @param {number} gameId - ID of the game
 * @param {string} title - Title of the game
 */
export const startGameSession = (gameId, title) => {
  // Record the start time
  gameStartTimes[gameId] = new Date();
  
  console.log(`Started playing: ${title}`);
  
  // Find the game in our data
  const gameIndex = gameUsageData.findIndex(game => game.id === gameId);
  
  // If the game exists, update its last played timestamp
  if (gameIndex !== -1) {
    gameUsageData[gameIndex].lastPlayed = new Date().toISOString();
  }
};

/**
 * End tracking time for a game and update the usage time
 * @param {number} gameId - ID of the game
 */
export const endGameSession = (gameId) => {
  // If we have a start time for this game
  if (gameStartTimes[gameId]) {
    const startTime = gameStartTimes[gameId];
    const endTime = new Date();
    
    // Calculate minutes spent (in a real app, you might want to round or format this)
    const minutesSpent = Math.round((endTime - startTime) / (1000 * 60));
    
    // Update the game's usage time
    updateGameTime(gameId, minutesSpent);
    
    // Clear the start time
    delete gameStartTimes[gameId];
    
    return minutesSpent;
  }
  
  return 0;
};

/**
 * Update game usage time
 * @param {number} gameId - ID of the game
 * @param {number} additionalMinutes - Minutes to add to the game's usage time
 */
export const updateGameTime = (gameId, additionalMinutes) => {
  const gameIndex = gameUsageData.findIndex(game => game.id === gameId);
  
  if (gameIndex !== -1) {
    gameUsageData[gameIndex].timeSpent += additionalMinutes;
    gameUsageData[gameIndex].lastPlayed = new Date().toISOString();
  }
};

/**
 * Get all game usage data
 * @returns {Array} Array of game usage objects
 */
export const getGameUsageData = () => {
  return [...gameUsageData];
};

/**
 * Get the top N most played games
 * @param {number} count - Number of games to return
 * @returns {Array} Array of top played games
 */
export const getTopPlayedGames = (count = 3) => {
  // Sort games by time spent (descending)
  const sortedGames = [...gameUsageData].sort((a, b) => b.timeSpent - a.timeSpent);
  
  // Return the top N games
  return sortedGames.slice(0, count);
};

/**
 * Simulate a game click (for testing purposes)
 * @param {number} gameId - ID of the game to simulate
 * @param {number} minutes - Minutes to add
 */
export const simulateGamePlay = (gameId, minutes = 5) => {
  const gameIndex = gameUsageData.findIndex(game => game.id === gameId);
  
  if (gameIndex !== -1) {
    gameUsageData[gameIndex].timeSpent += minutes;
    gameUsageData[gameIndex].lastPlayed = new Date().toISOString();
  }
};