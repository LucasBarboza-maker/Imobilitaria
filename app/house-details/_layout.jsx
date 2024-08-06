import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Platform, StatusBar, TouchableOpacity, ImageBackground, ScrollView, TextInput, Alert, Dimensions, Share } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { DefaultTheme, Provider as PaperProvider, Button, Modal, Portal } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CommentCard from '../../components/CommentCard';
import localStorageService from '../service/localStorageService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PagerView from 'react-native-pager-view';

// Create a custom theme
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2457C5',
  },
};

const { width: screenWidth } = Dimensions.get('window');

function DetailScreen() {
  const route = useRoute();
  const { houseId } = route.params;
  const navigation = useNavigation();
  const [house, setHouse] = React.useState(null);
  const [comments, setComments] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [newComment, setNewComment] = React.useState({ name: '', comment: '', rating: 0 });
  const [storedUser, setStoredUser] = React.useState({});
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [favoriteModalVisible, setFavoriteModalVisible] = React.useState(false);
  const [textoParaRemoverOuAdicionar, setTextoParaRemoverOuAdicionar] = React.useState('adicionar');
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [commentToDelete, setCommentToDelete] = React.useState(null);

  React.useEffect(() => {
    const fetchHouseDetails = async () => {
      const houses = await localStorageService.getAllItems('houses');
      const houseDetails = houses.find(house => house.id === houseId);
      setHouse(houseDetails);
      setComments(houseDetails?.comments || []);

      const user = JSON.parse(await AsyncStorage.getItem('logged'));
      setStoredUser(user);
      setIsFavorite(houseDetails?.favoriteUsers?.some(favUser => favUser.email === user.email) || false);
    };

    fetchHouseDetails();
  }, [houseId]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFavoriteStatus();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchFavoriteStatus = async () => {
    const houses = await localStorageService.getAllItems('houses');
    const houseDetails = houses.find(house => house.id === houseId);

    const user = JSON.parse(await AsyncStorage.getItem('logged'));
    setStoredUser(user);
    setIsFavorite(houseDetails?.favoriteUsers?.some(favUser => favUser.email === user.email) || false);
  };

  const handleAddComment = async (comment) => {
    const loggedUser = await localStorageService.getAllItems('logged');
    if (loggedUser.length === 0) {
      Alert.alert('Erro', 'Nenhum usuário está logado');
      return;
    }

    const newCommentWithUser = {
      ...comment,
      name: loggedUser[0].name,
      email: loggedUser[0].email
    };

    const updatedComments = [...comments, newCommentWithUser];
    setComments(updatedComments);

    const updatedHouse = {
      ...house,
      comments: updatedComments,
    };

    await localStorageService.updateItem('houses', updatedHouse.id, updatedHouse);

    setNewComment({ name: '', comment: '', rating: 0 });
    setModalVisible(false);
  };

  const toggleFavorite = async () => {
    const houses = await localStorageService.getAllItems('houses');
    const houseToUpdate = houses.find(house => house.id === houseId);

    if (storedUser) {
      if (houseToUpdate.favoriteUsers) {
        if (isFavorite) {
          houseToUpdate.favoriteUsers = houseToUpdate.favoriteUsers.filter((favoriteUser) => favoriteUser.email !== storedUser.email);
        } else {
          houseToUpdate.favoriteUsers.push(storedUser);
        }
      } else {
        houseToUpdate.favoriteUsers = [storedUser];
      }

      await localStorageService.updateItem('houses', houseToUpdate.id, houseToUpdate);
      setIsFavorite(!isFavorite);
    }

    setFavoriteModalVisible(false);
  };

  const handleFavoritePress = () => {
    setTextoParaRemoverOuAdicionar(isFavorite ? 'remover' : 'adicionar');
    setFavoriteModalVisible(true);
  };

  const handleDeletePress = (comment) => {
    setCommentToDelete(comment);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    const filteredComments = comments.filter((comment) => comment !== commentToDelete);
    house.comments = filteredComments;
    localStorageService.updateItem('houses', house.id, house);
    setComments(filteredComments);
    setDeleteModalVisible(false);
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

  const handleShare = async () => {
    try {
      const shareMessage = `Confira este imóvel na Imobilitária!\n\nTipo: ${house.propertyType}\nPreço: R$${house.price}/Mês\nDescrição: ${house.description}\nEstado: ${house.state}\nCidade: ${house.city}\nBairro: ${house.neighborhood}\nContato do anunciante: ${house.announcer.email}\nNome: ${house.announcer.name}\nTelefone: ${house.announcer.phone}`;
      await Share.share({
        message: shareMessage,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Erro', `Ocorreu um erro ao tentar compartilhar: ${error.message}`);
    }
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
        <PagerView style={styles.pagerView} initialPage={0}>
          {house.images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <ImageBackground
                source={{ uri: image }}
                style={styles.imageBackground}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
                  style={styles.gradient}
                />
                <View style={{ paddingLeft: 16 }}>
                  <Text style={styles.title}>{house.propertyType}</Text>
                </View>
                <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', padding: 16 }}>
                  <View>
                    <Text style={styles.title}><Text>R$</Text>{house.price}/<Text style={{ color: 'white', fontWeight: 'bold', fontSize: 22, textAlign: 'right' }}>Mês</Text></Text>
                  </View>
                  <View style={styles.iconContainer}>
                    <TouchableOpacity style={styles.iconButton} onPress={handleFavoritePress}>
                      <MaterialIcons name="favorite" size={24} color={isFavorite ? 'red' : 'white'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
                      <MaterialIcons name="share" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            </View>
          ))}
        </PagerView>
        <ScrollView style={styles.container}>
          <View style={styles.descriptionContainer}>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Descrição:</Text>
            <Text style={{ fontSize: 18, marginTop: 5 }}>{house.description}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.descriptionContainer}>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Faculdade Próxima:</Text>
            <Text style={{ fontSize: 18, marginTop: 5 }}>{house.nearbyCollege}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.descriptionContainer}>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Estado:</Text>
            <Text style={{ fontSize: 18, marginTop: 5, color: 'black' }}>{house.state}</Text>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Cidade:</Text>
            <Text style={{ fontSize: 18, marginTop: 5, color: 'black' }}>{house.city}</Text>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Bairro:</Text>
            <Text style={{ fontSize: 18, marginTop: 5 }}>{house.neighborhood}</Text>
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
                  email={comment.email}
                  rating={comment.rating}
                  onDelete={() => handleDeletePress(comment)}
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
          <Modal visible={favoriteModalVisible} onDismiss={() => setFavoriteModalVisible(false)} contentContainerStyle={styles.modal}>
            <Text>Deseja {textoParaRemoverOuAdicionar} este anúncio dos favoritos?</Text>
            <View style={styles.modalButtons}>
              <Button onPress={() => setFavoriteModalVisible(false)} mode="contained" style={styles.modalButton}>Não</Button>
              <Button onPress={toggleFavorite} mode="contained" style={styles.modalButton}>Sim</Button>
            </View>
          </Modal>
          <Modal visible={deleteModalVisible} onDismiss={() => setDeleteModalVisible(false)} contentContainerStyle={styles.modal}>
            <Text>Tem certeza que deseja excluir este comentário?</Text>
            <View style={styles.modalButtons}>
              <Button onPress={() => setDeleteModalVisible(false)} mode="contained" style={styles.modalButton}>Não</Button>
              <Button onPress={handleDeleteConfirm} mode="contained" style={styles.modalButton}>Sim</Button>
            </View>
          </Modal>
        </Portal>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('chat', { conversatorName: house.announcer.name })}
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
  pagerView: {
    width: screenWidth,
    height: 300,
  },
  imageContainer: {
    width: screenWidth,
    height: 300,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '50%',
  },
  iconButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
    marginLeft: 10,
  },
  title: {
    color: 'white',
    fontSize: 30,
  },
  descriptionContainer: {
    fontSize: 16,
    padding: 16,
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
    bottom: 100,
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
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  modalButton: {
    marginHorizontal: 10,
  },
});

export default DetailScreen;
