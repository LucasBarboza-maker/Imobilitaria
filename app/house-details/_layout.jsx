import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Platform, StatusBar, TouchableOpacity, ImageBackground, ScrollView, TextInput, Alert } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { DefaultTheme, Provider as PaperProvider, Button, Modal, Portal } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import CommentCard from '../../components/CommentCard';
import localStorageService from '../service/localStorageService';

// Create a custom theme
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2457C5',
  },
};

function DetailScreen() {
  const route = useRoute();
  const { houseId } = route.params;
  const navigation = useNavigation();
  const [house, setHouse] = React.useState(null);
  const [comments, setComments] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [newComment, setNewComment] = React.useState({ name: '', comment: '', rating: 0 });

  React.useEffect(() => {
    const fetchHouseDetails = async () => {
      const houses = await localStorageService.getAllItems('houses');
      const houseDetails = houses.find(house => house.id === houseId);
      setHouse(houseDetails);
      setComments(houseDetails?.comments || []);
    };

    fetchHouseDetails();
  }, [houseId]);

  const handleAddComment = async (comment) => {
    const loggedUser = await localStorageService.getAllItems('logged');
    if (loggedUser.length === 0) {
      Alert.alert('Erro', 'Nenhum usuário está logado');
      return;
    }

    const removeOrAddAnnouncement = async () => {
      const houses = await localStorageService.getAllItems('houses');
      const house = houses.find(house => house.id === id);

      if (storedUser) {
        const users = await localStorageService.getAllItems('users');
        const user = users.find(user => user.email === storedUser.email);

        if (house.favoriteUsers) {
          if (checarFavorito(house) === 'red') {
            house.favoriteUsers = house.favoriteUsers.filter((favoriteUser) => favoriteUser.email !== storedUser.email);
          } else {
            house.favoriteUsers.push(user);
          }
        } else {
          house.favoriteUsers = [];
          house.favoriteUsers.push(user);
        }

        localStorageService.updateItem('houses', house.id, house);
      }
      fetchFavoriteAnnouncements();
      hideModal();
    };


    function checarFavorito(announcement) {
      let favoriteUser = [];
      if (announcement.favoriteUsers) {
        favoriteUser = announcement.favoriteUsers.filter(fav => fav.email === storedUser.email);
        if (favoriteUser.length > 0) {
          return "red";
        }
      }
      return "gray";
    }


    const newCommentWithUser = {
      ...comment,
      name: loggedUser[0].name,
    };

    const updatedComments = [...comments, newCommentWithUser];
    setComments(updatedComments);

    const updatedHouse = {
      ...house,
      comments: updatedComments,
    };

    const houses = await localStorageService.getAllItems('houses');
    const updatedHouses = houses.map(h => (h.id === houseId ? updatedHouse : h));
    await localStorageService.setItem('houses', JSON.stringify(updatedHouses));

    setNewComment({ name: '', comment: '', rating: 0 });
    setModalVisible(false);
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <TouchableOpacity key={index} onPress={() => setNewComment({ ...newComment, rating: index + 1 })}>
        <MaterialIcons
          name={index < newComment.rating ? 'star' : 'star-border'}
          size={30}
          color="#FFD700"
        />
      </TouchableOpacity>
    ));
  };

  if (!house) {
    return (
      <PaperProvider theme={theme}>
        <SafeAreaView style={styles.safeArea}>
          <ExpoStatusBar style="auto" />
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        </SafeAreaView>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.safeArea}>
        <ExpoStatusBar style="auto" />
        <View style={styles.header}>
          {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity> */}
          {/* <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Voltar</Text> */}
        </View>
        <ImageBackground
          source={{ uri: house.images[0] }}
          style={styles.imageBackground}
        >
          <View style={{ paddingLeft: 16 }}>
            <Text style={styles.title}>{house.propertyType}</Text>
          </View>
          <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', padding: 16 }}>
            <View>
              <Text style={styles.title}><Text>R$</Text>{house.price}/<Text style={{ color: 'white', fontWeight: 'bold', fontSize: 22, textAlign: 'right' }}>Mês</Text></Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="favorite" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="share" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        <ScrollView style={styles.container}>
          <View style={styles.descriptionContainer}>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Description:</Text>
            <Text style={{ fontSize: 18, marginTop: 5 }}>{house.description}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.commentsContainer}>
            <View style={styles.commentsHeader}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Comentários:</Text>
              <Button mode="contained" onPress={() => setModalVisible(true)} >
                Comentar
              </Button>
            </View>
            {comments.length === 0 ? (
              <Text style={styles.emptyText}>Sem comentários registrados</Text>
            ) : (
              comments.map((comment, index) => (
                <CommentCard
                  key={index}
                  name={comment.name}
                  comment={comment.comment}
                  rating={comment.rating}
                />
              ))
            )}
          </View>
        </ScrollView>
        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
            <Text style={styles.modalTitle}>Adicionar Comentário</Text>
            <TextInput
              style={styles.input}
              placeholder="Comentário"
              value={newComment.comment}
              onChangeText={(text) => setNewComment({ ...newComment, comment: text })}
            />
            <View style={styles.starContainer}>
              {renderStars()}
            </View>
            <Button mode="contained" onPress={() => handleAddComment(newComment)}>
              Adicionar
            </Button>
          </Modal>
        </Portal>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('chat')}
        >
          <MaterialIcons name="chat" size={24} color="white" />
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  container: {
    flex: 1,
  },
  imageBackground: {
    width: '100%',
    height: 300,
    justifyContent: 'flex-end',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '50%'
  },
  iconButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
    marginLeft: 10,
  },
  title: {
    color: 'white',
    fontSize: 30
  },
  descriptionContainer: {
    fontSize: 16,
    padding: 16
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  commentsContainer: {
    padding: 16,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  chatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2457C5',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatButtonText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default DetailScreen;
