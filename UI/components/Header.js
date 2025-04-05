import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <View style={styles.profile}>
        <View style={styles.profilePic}></View>
        <View style={styles.profileInfo}>
          <Text style={styles.greeting}>App Name ,</Text>
          <Text style={styles.name}>Karen</Text>
        </View>
      </View>
      <View style={styles.coins}>
        <Text style={styles.coinIcon}>🟡</Text>
        <Text style={styles.coinCount}>999</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  profile: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    marginRight: 10,
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  greeting: {
    color: '#666',
    fontSize: 14,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  coins: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  coinIcon: {
    marginRight: 5,
    fontSize: 18,
  },
  coinCount: {
    fontWeight: 'bold',
  },
});

export default Header;