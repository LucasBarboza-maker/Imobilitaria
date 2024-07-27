import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import localStorageService from '../app/service/localStorageService';

const AnnouncementCard = ({ title, value, icon, imageSource, description, id, refresh, navigation }) => {
  const handleDelete = () => {
    Alert.alert(
      "Confirmação de Exclusão",
      "Tem certeza de que deseja excluir este anúncio?",
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: "Sim",
          onPress: async () => {

            const houses = await localStorageService.getAllItems('houses');
            const house = houses.filter(house => house.id === id);

            if(house){
              localStorageService.deleteItem('houses', house[0].id);
              refresh()
            }


          },
        },
      ],
      { cancelable: true }
    );
  };

  const goToEditScreen = () => {
    navigation.navigate("create-house", {id:id})
  }

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} />
        <TouchableOpacity style={styles.editIcon} onPress={goToEditScreen}>
          <MaterialIcons name="edit" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteIcon} onPress={handleDelete}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
        <View style={styles.bottomContainer}>
          <Text style={styles.title}>{title}</Text>
          <MaterialIcons name={icon} size={24} color="#fff" style={styles.icon} />
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.description}>{description ? description : "Sem Descrição"}</Text>
        <View style={styles.verticalDivider} />
        <View style={styles.valueContainer}>
          <Text style={styles.value}><Text style={{ color: '#4CAF50' }}>R$</Text>{value}</Text>
          <Text style={styles.month}>Mês</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
    elevation: 3,
  },
  imageContainer: {
    height: 125,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  editIcon: {
    position: 'absolute',
    top: 10,
    right: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    color: '#fff',
  },
  contentContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  description: {
    width: '65%',
    fontSize: 16,
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ccc',
    marginHorizontal: 16,
  },
  valueContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  month: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default AnnouncementCard;
