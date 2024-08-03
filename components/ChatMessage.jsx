import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function ChatMessage({ user, text }) {
  return (
    <View style={styles.messageContainer}>
      <Text style={styles.user}>{user}:</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    alignSelf: 'flex-start', // Adjust this to 'flex-end' for sent messages
    maxWidth: '80%',
  },
  user: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
  },
});

export default ChatMessage;
