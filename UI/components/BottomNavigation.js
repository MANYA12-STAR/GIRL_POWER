import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BottomNavigation = ({ activeTab = 'home', onNavigateToHome, onNavigateToGames, onNavigateToProfile, onNavigateToChatbot }) => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={[styles.navItem, activeTab === 'home' ? styles.active : null]} 
        onPress={onNavigateToHome}
      >
        <Ionicons name="home-outline" size={24} color="white" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, activeTab === 'games' ? styles.active : null]}
        onPress={onNavigateToGames}
      >
        <Ionicons name="game-controller-outline" size={24} color="white" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, activeTab === 'chatbot' ? styles.active : null]}
        onPress={onNavigateToChatbot}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, activeTab === 'profile' ? styles.active : null]}
        onPress={onNavigateToProfile}
      >
        <Ionicons name="person-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FF9800', // Orange
    padding: 15,
  },
  navItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%',
  },
  active: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
});

export default BottomNavigation;