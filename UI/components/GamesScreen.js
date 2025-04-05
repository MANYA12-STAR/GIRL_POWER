import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import GameCard from './GameCard';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import GameDescriptionModal from './GameDescriptionModal';
import { startGameSession, endGameSession } from '../utils/screenTimeUtils';

const GamesScreen = ({ onNavigateToHome, onNavigateToProfile, onNavigateToChatbot }) => {
  // State for modal visibility and selected game
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Handle game card click
  const handleGameCardPress = (id, title) => {
    const game = gameCards.find(g => g.id === id);
    setSelectedGame(game);
    setModalVisible(true);
    
    // Start tracking time for this game
    startGameSession(id, title);
    
    // In a real app, you would navigate to the game screen here
    // For demo purposes, we'll end the session after 5 seconds
    setTimeout(() => {
      const minutesSpent = endGameSession(id);
      console.log(`Ended playing: ${title}, spent ${minutesSpent} minutes`);
    }, 5000);
  };
  const gameCards = [
    { 
      id: 1, 
      title: "A tale of disappearing prince", 
      cardColor: '#FFF9C4', 
      characterColor: '#FF9800',
      description: "Help the prince find his way back home in this magical adventure!"
    },
    { 
      id: 2, 
      title: "The magical forest adventure", 
      cardColor: '#E8F5E9', 
      characterColor: '#4CAF50',
      description: "Explore the enchanted forest and discover its hidden secrets."
    },
    { 
      id: 3, 
      title: "Space explorers and aliens", 
      cardColor: '#E3F2FD', 
      characterColor: '#2196F3',
      description: "Blast off into space and meet friendly aliens on distant planets."
    },
    { 
      id: 4, 
      title: "Underwater treasure hunt", 
      cardColor: '#E0F7FA', 
      characterColor: '#00BCD4',
      description: "Dive deep to find ancient treasures in the ocean depths."
    },
    { 
      id: 5, 
      title: "Dinosaur time travel", 
      cardColor: '#FBE9E7', 
      characterColor: '#FF5722',
      description: "Travel back in time to meet dinosaurs and learn about prehistoric life."
    },
    { 
      id: 6, 
      title: "Robot friends forever", 
      cardColor: '#F3E5F5', 
      characterColor: '#9C27B0',
      description: "Build and program robots to solve fun challenges together."
    }
  ];

  return (
    <View style={styles.container}>
      <Header />
      
      <View style={styles.content}>
        <Text style={styles.title}>ALL GAMES</Text>
        
        <ScrollView contentContainerStyle={styles.gamesGrid}>
          {gameCards.map(game => (
            <View key={game.id} style={styles.cardWrapper}>
              <GameCard 
                id={game.id}
                title={game.title} 
                cardColor={game.cardColor} 
                characterColor={game.characterColor} 
                onPress={handleGameCardPress}
              />
            </View>
          ))}
        </ScrollView>
      </View>
      
      <BottomNavigation 
        activeTab="games" 
        onNavigateToHome={onNavigateToHome}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToChatbot={onNavigateToChatbot} 
      />
      
      <GameDescriptionModal 
        visible={modalVisible}
        game={selectedGame}
        onClose={() => setModalVisible(false)}
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
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  cardWrapper: {
    margin: 10,
  },
});

export default GamesScreen;