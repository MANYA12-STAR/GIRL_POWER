import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GameDescriptionModal = ({ visible, game, onClose }) => {
  if (!game) return null;
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          
          <Image 
            source={{ uri: 'https://placehold.co/300x200?text=Game+Image' }}
            style={styles.gameImage}
            resizeMode="cover"
          />
          
          <Text style={styles.gameTitle}>{game.title}</Text>
          
          <Text style={styles.gameDescription}>
            {game.description || 'This is a fun and educational game for kids. Play to learn new things and have fun!'}
          </Text>
          
          <TouchableOpacity 
            style={styles.playButton} 
            onPress={() => onClose()}
          >
            <Text style={styles.playButtonText}>PLAY NOW</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  gameImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  gameDescription: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  playButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 10,
  },
  playButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameDescriptionModal;