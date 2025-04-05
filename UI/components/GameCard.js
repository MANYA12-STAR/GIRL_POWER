import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const GameCard = ({ id, title, cardColor, characterColor, onPress }) => {
  // Use provided colors or default to the original colors
  const cardStyle = {
    ...styles.gameCard,
    backgroundColor: cardColor || '#FFF9C4', // Default: Light yellow
  };
  
  const characterStyle = {
    ...styles.character,
    backgroundColor: characterColor || '#FF9800', // Default: Orange
  };
  
  return (
    <TouchableOpacity style={cardStyle} onPress={() => onPress && onPress(id, title)}>
      <View style={characterStyle}>
        <View style={styles.eyes}>
          <View style={styles.eye}></View>
          <View style={styles.eye}></View>
        </View>
        <View style={styles.mouth}></View>
      </View>
      <View style={styles.gameTitle}>
        <Text style={styles.gameTitleText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gameCard: {
    width: 220,
    height: 300,
    backgroundColor: '#FFF9C4', // Light yellow
    borderRadius: 15,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  character: {
    backgroundColor: '#FF9800', // Orange
    height: 150,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  eyes: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
    marginBottom: 20,
  },
  eye: {
    width: 30,
    height: 30,
    backgroundColor: 'black',
    borderRadius: 15,
  },
  mouth: {
    width: 80,
    height: 40,
    backgroundColor: 'black',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  gameTitle: {
    padding: 15,
    textAlign: 'center',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameTitleText: {
    margin: 0,
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default GameCard;