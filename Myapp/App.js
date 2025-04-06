import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

const App = () => {
  const [emotion, setEmotion] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/get_emotion')
      .then(response => response.json())
      .then(data => setEmotion(data.emotion))
      .catch(error => console.error(error));
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {emotion ? (
        <Text>Detected Emotion: {emotion}</Text>
      ) : (
        <Text>Loading emotion...</Text>
      )}
      <Button title="Get Emotion" onPress={() => {}} />
    </View>
  );
};

export default App;
