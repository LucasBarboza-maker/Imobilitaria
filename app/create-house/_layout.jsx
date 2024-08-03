import * as React from 'react';
import { View, Text, StyleSheet, Image, StatusBar, SafeAreaView, Platform, Alert, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Button, DefaultTheme, Provider as PaperProvider, Menu, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PagerView from 'react-native-pager-view';
import localStorageService from '../service/localStorageService';
import { v4 as uuidv4 } from 'uuid'; // Import UUID

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

const STATES = [
  { label: 'Acre', value: 'AC' },
  { label: 'Alagoas', value: 'AL' },
  { label: 'Amapá', value: 'AP' },
  { label: 'Amazonas', value: 'AM' },
  { label: 'Bahia', value: 'BA' },
  { label: 'Ceará', value: 'CE' },
  { label: 'Distrito Federal', value: 'DF' },
  { label: 'Espírito Santo', value: 'ES' },
  { label: 'Goiás', value: 'GO' },
  { label: 'Maranhão', value: 'MA' },
  { label: 'Mato Grosso', value: 'MT' },
  { label: 'Mato Grosso do Sul', value: 'MS' },
  { label: 'Minas Gerais', value: 'MG' },
  { label: 'Pará', value: 'PA' },
  { label: 'Paraíba', value: 'PB' },
  { label: 'Paraná', value: 'PR' },
  { label: 'Pernambuco', value: 'PE' },
  { label: 'Piauí', value: 'PI' },
  { label: 'Rio de Janeiro', value: 'RJ' },
  { label: 'Rio Grande do Norte', value: 'RN' },
  { label: 'Rio Grande do Sul', value: 'RS' },
  { label: 'Rondônia', value: 'RO' },
  { label: 'Roraima', value: 'RR' },
  { label: 'Santa Catarina', value: 'SC' },
  { label: 'São Paulo', value: 'SP' },
  { label: 'Sergipe', value: 'SE' },
  { label: 'Tocantins', value: 'TO' }
];


const CITIES_RJ = [
  'Angra dos Reis',
  'Aperibé',
  'Araruama',
  'Areal',
  'Armação dos Búzios',
  'Arraial do Cabo',
  'Barra do Piraí',
  'Barra Mansa',
  'Belford Roxo',
  'Bom Jardim',
  'Bom Jesus do Itabapoana',
  'Cabo Frio',
  'Cachoeiras de Macacu',
  'Cambuci',
  'Campos dos Goytacazes',
  'Cantagalo',
  'Carapebus',
  'Cardoso Moreira',
  'Carmo',
  'Casimiro de Abreu',
  'Comendador Levy Gasparian',
  'Conceição de Macabu',
  'Cordeiro',
  'Duas Barras',
  'Duque de Caxias',
  'Engenheiro Paulo de Frontin',
  'Guapimirim',
  'Iguaba Grande',
  'Itaboraí',
  'Itaguaí',
  'Italva',
  'Itaocara',
  'Itaperuna',
  'Itatiaia',
  'Japeri',
  'Laje do Muriaé',
  'Macaé',
  'Macuco',
  'Magé',
  'Mangaratiba',
  'Maricá',
  'Mendes',
  'Mesquita',
  'Miguel Pereira',
  'Miracema',
  'Natividade',
  'Nilópolis',
  'Niterói',
  'Nova Friburgo',
  'Nova Iguaçu',
  'Paracambi',
  'Paraíba do Sul',
  'Paraty',
  'Paty do Alferes',
  'Petrópolis',
  'Pinheiral',
  'Piraí',
  'Porciúncula',
  'Porto Real',
  'Quatis',
  'Queimados',
  'Quissamã',
  'Resende',
  'Rio Bonito',
  'Rio Claro',
  'Rio das Flores',
  'Rio das Ostras',
  'Rio de Janeiro',
  'Santa Maria Madalena',
  'Santo Antônio de Pádua',
  'São Fidélis',
  'São Francisco de Itabapoana',
  'São Gonçalo',
  'São João da Barra',
  'São João de Meriti',
  'São José de Ubá',
  'São José do Vale do Rio Preto',
  'São Pedro da Aldeia',
  'São Sebastião do Alto',
  'Sapucaia',
  'Saquarema',
  'Seropédica',
  'Silva Jardim',
  'Sumidouro',
  'Tanguá',
  'Teresópolis',
  'Trajano de Moraes',
  'Três Rios',
  'Valença',
  'Varre-Sai',
  'Vassouras',
  'Volta Redonda'
];


const COLLEGES_RJ = [
  'Universidade Federal do Rio de Janeiro (UFRJ)',
  'Universidade do Estado do Rio de Janeiro (UERJ)',
  'Universidade Federal Fluminense (UFF)',
  'Universidade Federal Rural do Rio de Janeiro (UFRRJ)',
  'Centro Federal de Educação Tecnológica Celso Suckow da Fonseca (CEFET/RJ)',
  'Instituto Federal de Educação, Ciência e Tecnologia do Rio de Janeiro (IFRJ)',
  'Instituto Federal de Educação, Ciência e Tecnologia Fluminense (IFF)',
  'Universidade do Grande Rio (Unigranrio)',
  'Universidade Estadual do Norte Fluminense Darcy Ribeiro (UENF)',
  'Escola Nacional de Ciências Estatísticas (ENCE)',
  'Escola Superior de Desenho Industrial (ESDI)',
  'Fundação Centro Universitário Estadual da Zona Oeste (UEZO)',
  'Instituto Militar de Engenharia (IME)',
  'Universidade Federal do Estado do Rio de Janeiro (UNIRIO)',
  'Universidade Federal de Alfenas (UNIFAL)',
  'Fundação Getulio Vargas (FGV)'
];


function CreateHouseScreen() {
  const navigation = useNavigation();
  const [id, setId] = React.useState('');
  const [propertyType, setPropertyType] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [state, setState] = React.useState('');
  const [city, setCity] = React.useState('');
  const [neighborhood, setNeighborhood] = React.useState('');
  const [nearbyCollege, setNearbyCollege] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [images, setImages] = React.useState([]);
  const [propertyTypeMenuVisible, setPropertyTypeMenuVisible] = React.useState(false);
  const [stateMenuVisible, setStateMenuVisible] = React.useState(false);
  const [cityMenuVisible, setCityMenuVisible] = React.useState(false);
  const [collegeMenuVisible, setCollegeMenuVisible] = React.useState(false);
  const params = useLocalSearchParams();

  const [errors, setErrors] = React.useState({
    propertyType: false,
    price: false,
    state: false,
    city: false,
    neighborhood: false,
    nearbyCollege: false,
    description: false,
  });

  React.useEffect(() => {
    const fetchUserAnnouncements = async () => {
      const houses = await localStorageService.getAllItems('houses', params.id);
      const house = houses.filter((house) => house.id == params.id);

      setId(params.id);
      setPropertyType(house[0].propertyType);
      setPrice(house[0].price);
      setState(house[0].state);
      setCity(house[0].city);
      setNeighborhood(house[0].neighborhood);
      setNearbyCollege(house[0].nearbyCollege);
      setDescription(house[0].description);
      setImages(house[0].images);
    };

    if (params.id) {
      fetchUserAnnouncements();
    }
  }, [params.id]);

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
    const newErrors = {
      propertyType: !propertyType,
      price: !price,
      state: !state,
      city: !city,
      neighborhood: !neighborhood,
      nearbyCollege: !nearbyCollege,
      description: !description,
    };

    if (Object.values(newErrors).some(error => error)) {
      setErrors(newErrors);
      return;
    }

    try {
      const loggedUser = await localStorageService.getAllItems('logged');
      if (loggedUser.length === 0) {
        Alert.alert('Erro', 'Nenhum usuário está logado');
        return;
      }

      const house = {
        id: id ? id : Date.now(),
        propertyType,
        price,
        state,
        city,
        neighborhood,
        nearbyCollege,
        description,
        images,
        announcer: loggedUser[0],
      };

      if (id === '') {
        await localStorageService.saveItem('houses', house);
        Alert.alert("Sucesso", "Imóvel adicionado com sucesso");
      } else {
        Alert.alert("Sucesso", "Imóvel atualizado com sucesso");
        await localStorageService.updateItem('houses', house.id, house);
      }
      setTimeout(() => {
        navigation.goBack();
      }, 3500);

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
          <View style={{ borderWidth: 1, borderColor: errors.propertyType ? 'red' : 'black', borderRadius: 5, marginBottom: 16 }}>
            <Menu
              visible={propertyTypeMenuVisible}
              onDismiss={() => setPropertyTypeMenuVisible(false)}
              anchor={
                <TouchableOpacity onPress={() => setPropertyTypeMenuVisible(true)} style={styles.menuButton}>
                  <Text style={styles.menuText}>{propertyType || 'Selecione o tipo de imóvel'}</Text>
                  <Icon name="arrow-drop-down" size={24} color="#000" />
                </TouchableOpacity>
              }
            >
              <Menu.Item onPress={() => { setPropertyType('Casa'); setPropertyTypeMenuVisible(false); }} title="Casa" />
              <Menu.Item onPress={() => { setPropertyType('Kitnet'); setPropertyTypeMenuVisible(false); }} title="Kitnet" />
              <Menu.Item onPress={() => { setPropertyType('Apartamento'); setPropertyTypeMenuVisible(false); }} title="Apartamento" />
              <Menu.Item onPress={() => { setPropertyType('Imóvel Compartilhado'); setPropertyTypeMenuVisible(false); }} title="Imóvel Compartilhado" />
            </Menu>
          </View>
          {errors.propertyType && <Text style={styles.errorText}>Este campo é obrigatório.</Text>}

          <TextInput
            label="Valor do Imóvel"
            value={price}
            onChangeText={text => setPrice(text)}
            style={[styles.input, errors.price && styles.errorInput]}
            keyboardType="numeric"
            mode="outlined"
          />
          {errors.price && <Text style={styles.errorText}>Este campo é obrigatório.</Text>}

          <View style={{ borderWidth: 1, borderColor: errors.state ? 'red' : 'black', borderRadius: 5, marginBottom: 16 }}>
            <Menu
              visible={stateMenuVisible}
              onDismiss={() => setStateMenuVisible(false)}
              anchor={
                <TouchableOpacity onPress={() => setStateMenuVisible(true)} style={styles.menuButton}>
                  <Text style={styles.menuText}>{state || 'Selecione o estado'}</Text>
                  <Icon name="arrow-drop-down" size={24} color="#000" />
                </TouchableOpacity>
              }
            >
              {STATES.map((state, index) => (
                <Menu.Item key={index} onPress={() => { setState(state.value); setStateMenuVisible(false); }} title={state.label} />
              ))}
            </Menu>
          </View>
          {errors.state && <Text style={styles.errorText}>Este campo é obrigatório.</Text>}

          {state === 'RJ' && (
            <>
              <View style={{ borderWidth: 1, borderColor: errors.city ? 'red' : 'black', borderRadius: 5, marginBottom: 16 }}>
                <Menu
                  visible={cityMenuVisible}
                  onDismiss={() => setCityMenuVisible(false)}
                  anchor={
                    <TouchableOpacity onPress={() => setCityMenuVisible(true)} style={styles.menuButton}>
                      <Text style={styles.menuText}>{city || 'Selecione a cidade'}</Text>
                      <Icon name="arrow-drop-down" size={24} color="#000" />
                    </TouchableOpacity>
                  }
                >
                  {CITIES_RJ.map((city, index) => (
                    <Menu.Item key={index} onPress={() => { setCity(city); setCityMenuVisible(false); }} title={city} />
                  ))}
                </Menu>
              </View>
              {errors.city && <Text style={styles.errorText}>Este campo é obrigatório.</Text>}

              <View style={{ borderWidth: 1, borderColor: errors.nearbyCollege ? 'red' : 'black', borderRadius: 5, marginBottom: 16 }}>
                <Menu
                  visible={collegeMenuVisible}
                  onDismiss={() => setCollegeMenuVisible(false)}
                  anchor={
                    <TouchableOpacity onPress={() => setCollegeMenuVisible(true)} style={styles.menuButton}>
                      <Text style={styles.menuText}>{nearbyCollege || 'Selecione a faculdade próxima'}</Text>
                      <Icon name="arrow-drop-down" size={24} color="#000" />
                    </TouchableOpacity>
                  }
                >
                  {COLLEGES_RJ.map((college, index) => (
                    <Menu.Item key={index} onPress={() => { setNearbyCollege(college); setCollegeMenuVisible(false); }} title={college} />
                  ))}
                </Menu>
              </View>
              {errors.nearbyCollege && <Text style={styles.errorText}>Este campo é obrigatório.</Text>}
            </>
          )}

          <TextInput
            label="Bairro"
            value={neighborhood}
            onChangeText={text => setNeighborhood(text)}
            style={[styles.input, errors.neighborhood && styles.errorInput]}
            mode="outlined"
          />
          {errors.neighborhood && <Text style={styles.errorText}>Este campo é obrigatório.</Text>}

          <TextInput
            label="Descrição"
            value={description}
            onChangeText={text => setDescription(text)}
            style={[styles.input, styles.descriptionInput, errors.description && styles.errorInput]}
            multiline
            mode="outlined"
          />
          {errors.description && <Text style={styles.errorText}>Este campo é obrigatório.</Text>}

          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            {id ? 'Editar' : 'Adicionar'} Imóvel
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
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  errorInput: {
    borderColor: 'red',
  },
  button: {
    marginVertical: 16,
  },
  pagerView: {
    width: viewportWidth,
    height: 200,
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
  menuButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    marginTop: 0,
  },
});

export default CreateHouseScreen;
