import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import localStorageService from '../app/service/localStorageService';

const CommentCard = ({ name, comment, email, rating, onDelete }) => {

  const [loggedUserEmail, setLoggedUserEmail] = React.useState('');

  useEffect(() => {
    const fetchUser = async () => {
    const loggedUser = await localStorageService.getAllItems('logged');
    console.log(email)
    setLoggedUserEmail(loggedUser[0].email)
    if (loggedUser.length === 0) {
      Alert.alert('Erro', 'Nenhum usuário está logado');
      return;
    }
  }

  fetchUser();
  }, [])
  return (
    <View style={styles.card}>
      {loggedUserEmail == email ? <TouchableOpacity style={styles.deleteIcon} onPress={onDelete}>
        <MaterialIcons name="delete" size={24} color="#FF0000" />
      </TouchableOpacity> : <></>}
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
    position: 'relative',
  },
  deleteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
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
