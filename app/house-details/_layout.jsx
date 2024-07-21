import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Platform, StatusBar, TouchableOpacity, ImageBackground, ScrollView, TextInput } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { DefaultTheme, Provider as PaperProvider, Button, Modal, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import CommentCard from '../../components/CommentCard';

// Create a custom theme
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2457C5',
  },
};

const commentsData = [
  { name: 'John Doe', comment: 'Great place, really enjoyed my stay!', rating: 5 },
  { name: 'Jane Smith', comment: 'Nice house, but a bit far from the beach.', rating: 4 },
  { name: 'Sam Wilson', comment: 'Average experience, could be better.', rating: 3 },
];

function DetailScreen() {
  const navigation = useNavigation();
  const [comments, setComments] = React.useState(commentsData);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [newComment, setNewComment] = React.useState({ name: '', comment: '', rating: 0 });

  const handleAddComment = () => {
    setComments([...comments, newComment]);
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

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.safeArea}>
        <ExpoStatusBar style="auto" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Voltar</Text>
        </View>
        <ImageBackground
          source={require('../../assets/images/home_bg_image.png')}
          style={styles.imageBackground}
        >
          <View style={{ paddingLeft: 16 }}>
            <Text style={styles.title}>Casa perto da praia</Text>
          </View>
          <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', padding: 16 }}>
            <View>
              <Text style={styles.title}><Text>R$</Text>10000/<Text style={{ color: 'white', fontWeight: 'bold', fontSize: 22, textAlign: 'right' }}>Mês</Text></Text>
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
            <Text style={{ fontSize: 18, marginTop: 5 }}>Sem Descrição</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.commentsContainer}>
            <View style={styles.commentsHeader}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Comentários:</Text>
              <Button mode="contained" onPress={() => setModalVisible(true)}>
                Comentar
              </Button>
            </View>
            {comments.map((comment, index) => (
              <CommentCard
                key={index}
                name={comment.name}
                comment={comment.comment}
                rating={comment.rating}
              />
            ))}
          </View>
        </ScrollView>
        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
            <Text style={styles.modalTitle}>Adicionar Comentário</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={newComment.name}
              onChangeText={(text) => setNewComment({ ...newComment, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Comentário"
              value={newComment.comment}
              onChangeText={(text) => setNewComment({ ...newComment, comment: text })}
            />
            <View style={styles.starContainer}>
              {renderStars()}
            </View>
            <Button mode="contained" onPress={handleAddComment}>
              Adicionar
            </Button>
          </Modal>
        </Portal>
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
});

export default DetailScreen;
