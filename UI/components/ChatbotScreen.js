import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import { Ionicons } from '@expo/vector-icons';

const ChatbotScreen = ({ onNavigateToHome, onNavigateToGames, onNavigateToProfile }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm your friendly learning assistant. How can I help you today?", isBot: true },
  ]);
  const [inputText, setInputText] = useState('');

  // Function to handle sending a new message
  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
    };
    
    setMessages([...messages, newUserMessage]);
    setInputText('');
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponses = [
        "That's a great question! Let's learn about it together.",
        "I can help you with that! Would you like to play a game about this topic?",
        "Did you know? Learning new things helps your brain grow stronger!",
        "That's interesting! Let me tell you more about it.",
        "I love your curiosity! Let's explore this topic together."
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const newBotMessage = {
        id: messages.length + 2,
        text: randomResponse,
        isBot: true,
      };
      
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Header />
      
      <View style={styles.content}>
        <Text style={styles.title}>CHAT WITH BUDDY</Text>
        
        <View style={styles.chatContainer}>
          <ScrollView 
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
          >
            {messages.map((message) => (
              <View 
                key={message.id} 
                style={[
                  styles.messageBubble,
                  message.isBot ? styles.botMessage : styles.userMessage
                ]}
              >
                {message.isBot && (
                  <View style={styles.botAvatar}>
                    <Text style={styles.botAvatarText}>🤖</Text>
                  </View>
                )}
                <View style={styles.messageContent}>
                  <Text style={styles.messageText}>{message.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask me anything..."
              placeholderTextColor="#999"
              multiline
            />
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={handleSendMessage}
              disabled={inputText.trim() === ''}
            >
              <Ionicons 
                name="send" 
                size={24} 
                color={inputText.trim() === '' ? "#ccc" : "#FF9800"} 
              />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </View>
      
      <BottomNavigation 
        activeTab="chatbot" 
        onNavigateToHome={onNavigateToHome} 
        onNavigateToGames={onNavigateToGames}
        onNavigateToProfile={onNavigateToProfile} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffde7', // Light yellow tint
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
  chatContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  messagesContent: {
    paddingBottom: 10,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 15,
    maxWidth: '80%',
  },
  botMessage: {
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  botAvatarText: {
    fontSize: 20,
  },
  messageContent: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 15,
    borderTopLeftRadius: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  messageContent: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 15,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatbotScreen;