import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import { Ionicons } from '@expo/vector-icons';
import { getGameUsageData, formatTime, getTotalScreenTime } from '../utils/screenTimeUtils';

const ProfileScreen = ({ onNavigateToHome, onNavigateToGames, onNavigateToChatbot }) => {
  // State for user data and game history
  const [userData, setUserData] = useState({
    name: 'Karen',
    age: 8,
    avatar: '👧', // Using emoji as placeholder
    totalPlayTime: '0m',
    favoriteGame: '',
    points: 2450,
  });

  const [gameHistory, setGameHistory] = useState([]);
  
  // Load and update game data
  useEffect(() => {
    const updateGameData = () => {
      // Get all game usage data
      const games = getGameUsageData();
      
      // Sort by last played time (most recent first)
      const sortedGames = [...games]
        .filter(game => game.lastPlayed) // Only include games that have been played
        .sort((a, b) => {
          if (!a.lastPlayed) return 1;
          if (!b.lastPlayed) return -1;
          return new Date(b.lastPlayed) - new Date(a.lastPlayed);
        });
      
      // Format game history data
      const formattedHistory = sortedGames.map(game => {
        // Calculate relative time for "date" field
        let dateText = 'Never played';
        if (game.lastPlayed) {
          const lastPlayed = new Date(game.lastPlayed);
          const now = new Date();
          const diffMs = now - lastPlayed;
          const diffMins = Math.floor(diffMs / (1000 * 60));
          const diffHours = Math.floor(diffMins / 60);
          const diffDays = Math.floor(diffHours / 24);
          
          if (diffMins < 60) {
            dateText = diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`;
          } else if (diffHours < 24) {
            dateText = diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
          } else if (diffDays < 7) {
            dateText = diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
          } else {
            dateText = `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
          }
        }
        
        // Calculate progress as percentage of time spent relative to most played game
        const maxTimeSpent = Math.max(...games.map(g => g.timeSpent));
        const progress = maxTimeSpent > 0 ? Math.round((game.timeSpent / maxTimeSpent) * 100) : 0;
        
        return {
          id: game.id,
          title: game.title,
          date: dateText,
          duration: formatTime(game.timeSpent),
          progress: progress,
        };
      });
      
      setGameHistory(formattedHistory);
      
      // Update user data
      const totalTime = getTotalScreenTime();
      const favoriteGame = sortedGames.length > 0 ? sortedGames[0].title : 'No games played yet';
      
      setUserData(prev => ({
        ...prev,
        totalPlayTime: formatTime(totalTime),
        favoriteGame: favoriteGame,
      }));
    };
    
    // Initial update
    updateGameData();
    
    // Set up interval to refresh data every 5 seconds
    const intervalId = setInterval(updateGameData, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      
      <ScrollView style={styles.content}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{userData.avatar}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userAge}>{userData.age} years old</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={18} color="#555" />
                <Text style={styles.statText}>{userData.totalPlayTime}</Text>
              </View>
              <View style={styles.statItem}>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="trophy-outline" size={18} color="#555" />
                <Text style={styles.statText}>{userData.points} pts</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Favorite Game Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FAVORITE GAME</Text>
          <View style={styles.favoriteGame}>
            <Ionicons name="heart" size={24} color="#FF5252" />
            <Text style={styles.favoriteGameText}>{userData.favoriteGame}</Text>
          </View>
        </View>
        
        {/* Game History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GAME HISTORY</Text>
          {gameHistory.map(game => (
            <View key={game.id} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>{game.title}</Text>
                <Text style={styles.historyDate}>{game.date}</Text>
              </View>
              
              <View style={styles.historyDetails}>
                <View style={styles.historyDetail}>
                  <Ionicons name="time-outline" size={16} color="#555" />
                  <Text style={styles.historyDetailText}>{game.duration}</Text>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[styles.progressFill, { width: `${game.progress}%` }]} 
                    />
                  </View>
                  <Text style={styles.progressText}>{game.progress}%</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <BottomNavigation 
        activeTab="profile" 
        onNavigateToHome={onNavigateToHome} 
        onNavigateToGames={onNavigateToGames}
        onNavigateToChatbot={onNavigateToChatbot} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 20,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatar: {
    fontSize: 40,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userAge: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555',
  },
  section: {
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  favoriteGame: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF9C4',
    padding: 15,
    borderRadius: 10,
  },
  favoriteGameText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  historyDate: {
    fontSize: 14,
    color: '#888',
  },
  historyDetails: {
    marginTop: 5,
  },
  historyDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyDetailText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#555',
    width: 40,
    textAlign: 'right',
  },
});

export default ProfileScreen;