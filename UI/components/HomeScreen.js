import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Image } from 'react-native';
import Header from './Header';
import GameCarousel from './GameCarousel';
import BottomNavigation from './BottomNavigation';
import { Ionicons } from '@expo/vector-icons';
import { getTotalScreenTime, formatTime, getScreenTimePercentage, getGameUsageData, getTopPlayedGames } from '../utils/screenTimeUtils';

const HomeScreen = ({ onNavigateToGames, onNavigateToProfile, onNavigateToChatbot }) => {
  // State to store screen time data
  const [totalScreenTime, setTotalScreenTime] = useState(0);
  const [screenTimePercentage, setScreenTimePercentage] = useState(0);
  const [topGames, setTopGames] = useState([]);
  const [gameData, setGameData] = useState([]);
  
  // Animation values for progress bars
  const [progressAnimations] = useState(() => {
    return topGames.map(() => new Animated.Value(0));
  });

  // Load screen time data when component mounts
  useEffect(() => {
    // Function to update screen time data
    const updateScreenTimeData = () => {
      // Get total screen time
      const total = getTotalScreenTime();
      setTotalScreenTime(total);
      
      // Get percentage of daily limit
      const percentage = getScreenTimePercentage();
      setScreenTimePercentage(percentage);
      
      // Get top played games
      const topPlayedGames = getTopPlayedGames(3);
      setTopGames(topPlayedGames);
      
      // Get all game data
      const games = getGameUsageData();
      setGameData(games);
      
      // Animate progress bars
      if (topPlayedGames.length > 0) {
        const maxTime = Math.max(...topPlayedGames.map(game => game.timeSpent));
        
        // Create new animation values if needed
        if (progressAnimations.length !== topPlayedGames.length) {
          progressAnimations.splice(0, progressAnimations.length);
          topPlayedGames.forEach(() => progressAnimations.push(new Animated.Value(0)));
        }
        
        // Animate each progress bar
        const animations = topPlayedGames.map((game, index) => {
          const targetValue = maxTime > 0 ? game.timeSpent / maxTime : 0;
          return Animated.timing(progressAnimations[index], {
            toValue: targetValue,
            duration: 1000,
            useNativeDriver: false
          });
        });
        
        Animated.stagger(200, animations).start();
      }
    };
    
    // Initial update
    updateScreenTimeData();
    
    // Set up interval to refresh data every 5 seconds
    const intervalId = setInterval(updateScreenTimeData, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Get icon for game based on its index
  const getGameIcon = (index) => {
    const icons = [
      <Ionicons name="trophy-outline" size={18} color="white" />,
      <Ionicons name="medal-outline" size={18} color="white" />,
      <Ionicons name="ribbon-outline" size={18} color="white" />
    ];
    return icons[index] || <Ionicons name="game-controller-outline" size={18} color="white" />;
  };

  // Get color for game based on its index
  const getGameColor = (index) => {
    const colors = ['#FF9800', '#4CAF50', '#2196F3'];
    return colors[index] || '#9C27B0';
  };

  return (
    <View style={styles.container}>
      <Header />
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.welcomeTitle}>Welcome</Text>
          <Text style={styles.welcomeText}>Enjoy playing our fun games!</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GAMES</Text>
          <GameCarousel />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROGRESS TRACKER</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Today's Activity</Text>
              <View style={styles.progressBadge}>
                <Text style={styles.progressTotal}>{formatTime(totalScreenTime)}</Text>
              </View>
            </View>
            
            <View style={styles.mainProgressContainer}>
              <View style={styles.mainProgressBar}>
                <Animated.View 
                  style={[styles.mainProgressFill, { width: `${screenTimePercentage}%` }]} 
                />
              </View>
              <View style={styles.progressLabels}>
                <View style={styles.progressLabelContainer}>
                  <Ionicons name="time-outline" size={16} color="#FF9800" />
                  <Text style={styles.progressLabelText}>Daily Goal: 3h</Text>
                </View>
                <Text style={styles.progressPercentage}>{screenTimePercentage}%</Text>
              </View>
            </View>
            
            <View style={styles.gameProgressList}>
              {topGames.map((game, index) => (
                <View key={game.id} style={styles.gameProgressItem}>
                  <View style={styles.gameProgressHeader}>
                    <View style={[styles.gameIcon, { backgroundColor: getGameColor(index) }]}>
                      {getGameIcon(index)}
                    </View>
                    <Text style={styles.gameTitle} numberOfLines={1} ellipsizeMode="tail">{game.title}</Text>
                    <Text style={styles.gameTime}>{formatTime(game.timeSpent)}</Text>
                  </View>
                  
                  <View style={styles.gameProgressBarContainer}>
                    <Animated.View 
                      style={[styles.gameProgressBar, { 
                        width: progressAnimations[index] ? 
                          progressAnimations[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%']
                          }) : '0%',
                        backgroundColor: getGameColor(index)
                      }]} 
                    />
                  </View>
                </View>
              ))}
              {topGames.length === 0 && (
                <View style={styles.noDataMessage}>
                  <Ionicons name="game-controller-outline" size={40} color="#ccc" />
                  <Text style={styles.noDataText}>No games played yet. Try clicking on a game!</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GAME PROGRESS</Text>
          <View style={styles.circularProgressContainer}>
            {topGames.length > 0 ? (
              <View style={styles.circularProgressWrapper}>
                <View style={styles.circularProgress}>
                  <View style={[styles.circularProgressBar, {
                    transform: [{ rotate: `${screenTimePercentage * 3.6}deg` }]
                  }]} />
                  <View style={styles.circularProgressInner}>
                    <Text style={styles.circularProgressText}>{screenTimePercentage}%</Text>
                  </View>
                </View>
                <Text style={styles.circularProgressLabel}>Last Played</Text>
              </View>
            ) : (
              <View style={styles.noDataMessage}>
                <Ionicons name="game-controller-outline" size={40} color="#ccc" />
                <Text style={styles.noDataText}>No games played yet</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      
      <BottomNavigation 
        activeTab="home" 
        onNavigateToHome={() => {}} 
        onNavigateToGames={onNavigateToGames}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToChatbot={onNavigateToChatbot} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  animation: {
    width: '100%',
    height: 350,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFDE7',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    zIndex: -1,
  },
  star: {
    position: 'absolute',
    width: 5,
    height: 5,
    backgroundColor: '#FFD600',
    borderRadius: 50,
  },
  squiggle: {
    position: 'absolute',
    width: 30,
    height: 10,
    borderColor: '#FFD600',
    borderWidth: 1,
    borderRadius: 10,
  },

  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  content: {
    flex: 1,  
    padding: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  progressContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBadge: {
    backgroundColor: '#FF9800',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  progressTotal: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  mainProgressContainer: {
    marginBottom: 20,
  },
  mainProgressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
  },
  mainProgressFill: {
    height: '100%',
    backgroundColor: '#FF9800',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressLabelText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  gameProgressList: {
    marginTop: 10,
  },
  gameProgressItem: {
    marginBottom: 15,
  },
  gameProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  gameIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  gameTitle: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  gameTime: {
    fontSize: 12,
    color: '#666',
  },
  gameProgressBarContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  gameProgressBar: {
    height: '100%',
  },
  noDataMessage: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noDataText: {
    marginTop: 10,
    color: '#999',
    textAlign: 'center',
  },
  circularProgressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  circularProgressWrapper: {
    alignItems: 'center',
  },
  circularProgress: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circularProgressBar: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 75,
    backgroundColor: '#FF9800',
    clip: 'rect(0, 75px, 150px, 0)',
  },
  circularProgressInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgressText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  circularProgressLabel: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  achievementsContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 15,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF9C4',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementIconText: {
    fontSize: 20,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBadge: {
    backgroundColor: '#FFF9C4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFE082',
  },
  progressTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  mainProgressContainer: {
    marginBottom: 25,
  },
  mainProgressBar: {
    height: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  mainProgressFill: {
    height: '100%',
    backgroundColor: '#FF9800',
    borderRadius: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressLabelText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  gameProgressList: {
    marginTop: 10,
  },
  gameProgressItem: {
    marginBottom: 20,
  },
  gameProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  gameIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  gameTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  gameTime: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
  gameProgressBarContainer: {
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  gameProgressBar: {
    height: '100%',
    borderRadius: 6,
  },
  noDataMessage: {
    alignItems: 'center',
  },
});

export default HomeScreen;