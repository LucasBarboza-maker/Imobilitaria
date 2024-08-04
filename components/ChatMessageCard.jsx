import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MessageCard = ({ conversatorName, hour, lastMessage, messages }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('chat', { conversatorName, messages });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.cardContent}>
        <Text style={styles.conversatorName}>{conversatorName}</Text>
        <Text style={styles.hour}>{hour}</Text>
        <Text style={styles.lastMessage}>{lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#cecece', 
  },
  cardContent: {
    flexDirection: 'column',
  },
  conversatorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  hour: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#333',
  },
});

export default MessageCard;
