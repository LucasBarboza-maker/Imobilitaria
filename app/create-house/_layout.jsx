import * as React from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView, Platform, Image, Alert, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Button, DefaultTheme, Provider as PaperProvider, Menu, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PagerView from 'react-native-pager-view';
import localStorageService from '../service/localStorageService';
import { v4 as uuidv4 } from 'uuid'; // Import UUID

// Create a custom theme
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2457C5',
    placeholder: 'gray',
  },
};

const { width: viewportWidth } = Dimensions.get('window');

function CreateHouseScreen() {
  const navigation = useNavigation();
  const [propertyType, setPropertyType] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [city, setCity] = React.useState('');
  const [neighborhood, setNeighborhood] = React.useState('');
  const [nearbyCollege, setNearbyCollege] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [images, setImages] = React.useState([]);
  const [menuVisible, setMenuVisible] = React.useState(false);

  React.useEffect(() => {
    const loadImages = async () => {
      const savedImages = await AsyncStorage.getItem('uploadedImages');
      if (savedImages) {
        setImages(JSON.parse(savedImages));
      }
    };
    loadImages();
  }, []);

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const base64 = await convertToBase64(uri);
      const newImages = [...images, base64];
      setImages(newImages);
      await AsyncStorage.setItem('uploadedImages', JSON.stringify(newImages));
    }
  };

  const convertToBase64 = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        const reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.open('GET', uri);
      xhr.responseType = 'blob';
      xhr.send();
    });
  };

  const deleteImage = (index) => {
    Alert.alert(
      "Delete Image",
      "Are you sure you want to delete this image?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete", 
          onPress: async () => {
            const updatedImages = images.filter((_, i) => i !== index);
            setImages(updatedImages);
            await AsyncStorage.setItem('uploadedImages', JSON.stringify(updatedImages));
          }
        }
      ],
      { cancelable: true }
    );
  };

  const handleSubmit = async () => {
    try {
      const loggedUser = await localStorageService.getAllItems('logged');
      if (loggedUser.length === 0) {
        Alert.alert('Erro', 'Nenhum usuário está logado');
        return;
      }

      const newHouse = {
        id: uuidv4(), // Generate UUID for the house
        propertyType,
        price,
        city,
        neighborhood,
        nearbyCollege,
        description,
        images,
        announcer: loggedUser[0],
      };

      await localStorageService.saveItem('houses', newHouse);

      // Clear the input fields
      setPropertyType('');
      setPrice('');
      setCity('');
      setNeighborhood('');
      setNearbyCollege('');
      setDescription('');
      setImages([]);

      Alert.alert("Sucesso", "Imóvel adicionado com sucesso");
    } catch (error) {
      console.error('Erro ao adicionar imóvel', error);
      Alert.alert('Erro', 'Erro ao adicionar imóvel');
    }
  };

  const renderItem = (item, index) => (
    <View style={styles.imageContainer} key={index}>
      <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
      <Button mode="text" onPress={() => deleteImage(index)} style={styles.deleteButton}>
        <Icon name="delete" size={20} color="red" />
      </Button>
    </View>
  );

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.safeArea}>
        <ExpoStatusBar style="auto" />
        <Text style={styles.title}>Adicionar Imóvel</Text>

        {images.length > 0 && (
          <PagerView style={styles.pagerView} initialPage={0}>
            {images.map((item, index) => renderItem(item, index))}
          </PagerView>
        )}

        <Button mode="contained" onPress={handleImageUpload} style={styles.button}>
          Upload de Imagens
        </Button>

        <ScrollView>
          <View>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button onPress={() => setMenuVisible(true)}>
                  Tipo de Imóvel
                </Button>
              }
            >
              <Menu.Item onPress={() => { setPropertyType('Casa'); setMenuVisible(false); }} title="Casa" />
              <Menu.Item onPress={() => { setPropertyType('Kitnet'); setMenuVisible(false); }} title="Kitnet" />
              <Menu.Item onPress={() => { setPropertyType('Apartamento'); setMenuVisible(false); }} title="Apartamento" />
              <Menu.Item onPress={() => { setPropertyType('Imóvel Compartilhado'); setMenuVisible(false); }} title="Imóvel Compartilhado" />
            </Menu>
            <Text>{propertyType}</Text>
          </View>

          <TextInput
            label="Valor do Imóvel"
            value={price}
            onChangeText={text => setPrice(text)}
            style={styles.input}
            keyboardType="numeric"
          />

          <TextInput
            label="Cidade"
            value={city}
            onChangeText={text => setCity(text)}
            style={styles.input}
          />

          <TextInput
            label="Bairro"
            value={neighborhood}
            onChangeText={text => setNeighborhood(text)}
            style={styles.input}
          />

          <TextInput
            label="Faculdade Próxima"
            value={nearbyCollege}
            onChangeText={text => setNearbyCollege(text)}
            style={styles.input}
          />

          <TextInput
            label="Descrição"
            value={description}
            onChangeText={text => setDescription(text)}
            style={[styles.input, styles.descriptionInput]}
            multiline
          />

          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Adicionar Imóvel
          </Button>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    padding: 16
  },
  scrollView: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 10
  },
  input: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 16,
  },
  pagerView: {
    width: viewportWidth,
    height: viewportWidth,
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  descriptionInput: {
    height: 100,
  },
});

export default CreateHouseScreen;
