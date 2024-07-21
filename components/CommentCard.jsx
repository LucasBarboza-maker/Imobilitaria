import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CommentCard = ({ name, comment, rating }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.comment}>{comment}</Text>
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, index) => (
          <MaterialIcons
            key={index}
            name={index < rating ? 'star' : 'star-border'}
            size={24}
            color="#FFD700"
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  comment: {
    fontSize: 16,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
});

export default CommentCard;
