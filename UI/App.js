import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import HomeScreen from './components/HomeScreen';
import GamesScreen from './components/GamesScreen';
import ProfileScreen from './components/ProfileScreen';
import ChatbotScreen from './components/ChatbotScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  
  const navigateToHome = () => setCurrentScreen('home');
  const navigateToGames = () => setCurrentScreen('games');
  const navigateToProfile = () => setCurrentScreen('profile');
  const navigateToChatbot = () => setCurrentScreen('chatbot');
  
  return (
    <SafeAreaView style={styles.container}>
      {currentScreen === 'home' ? (
        <HomeScreen 
          onNavigateToGames={navigateToGames} 
          onNavigateToProfile={navigateToProfile}
          onNavigateToChatbot={navigateToChatbot} 
        />
      ) : currentScreen === 'games' ? (
        <GamesScreen 
          onNavigateToHome={navigateToHome} 
          onNavigateToProfile={navigateToProfile}
          onNavigateToChatbot={navigateToChatbot} 
        />
      ) : currentScreen === 'chatbot' ? (
        <ChatbotScreen 
          onNavigateToHome={navigateToHome} 
          onNavigateToGames={navigateToGames}
          onNavigateToProfile={navigateToProfile} 
        />
      ) : (
        <ProfileScreen 
          onNavigateToHome={navigateToHome} 
          onNavigateToGames={navigateToGames}
          onNavigateToChatbot={navigateToChatbot} 
        />
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffde7', // Light yellow tint
    paddingTop: 30, // Added padding to the top of the page
  },
});
