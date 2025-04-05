import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GameCard from './GameCard';
import GameDescriptionModal from './GameDescriptionModal';
import { startGameSession, endGameSession } from '../utils/screenTimeUtils';

const GameCarousel = () => {
  // Game data from GamesScreen with different colors for each card
  const gameCards = [
    { 
      id: 1, 
      title: "Door 2 Door ", 
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

  // State to track current card index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handler for previous button
  const handlePrevious = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? gameCards.length - 1 : prevIndex - 1
    );
  };

  // Handler for next button
  const handleNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === gameCards.length - 1 ? 0 : prevIndex + 1
    );
  };

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

  return (
    <View>
      <View style={styles.gameCarousel}>
        <TouchableOpacity style={styles.navArrow} onPress={handlePrevious}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <GameCard 
          id={gameCards[currentIndex].id}
          title={gameCards[currentIndex].title}
          cardColor={gameCards[currentIndex].cardColor}
          characterColor={gameCards[currentIndex].characterColor}
          onPress={handleGameCardPress}
        />
        
        <TouchableOpacity style={styles.navArrow} onPress={handleNext}>
          <Ionicons name="chevron-forward" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.pagination}>
        {gameCards.map((_, index) => (
          <View 
            key={index} 
            style={[styles.dot, index === currentIndex ? styles.activeDot : null]}
          ></View>
        ))}
      </View>
      
      <GameDescriptionModal 
        visible={modalVisible}
        game={selectedGame}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gameCarousel: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navArrow: {
    backgroundColor: 'transparent',
    padding: 10,
  },
  pagination: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#FF9800', // Orange
  },
});

export default GameCarousel;