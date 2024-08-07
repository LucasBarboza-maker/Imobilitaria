import * as React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, SafeAreaView, Platform, TouchableOpacity, Keyboard } from 'react-native';
import { useNavigation } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Button, DefaultTheme, Provider as PaperProvider, Modal, Portal, TextInput, Menu } from 'react-native-paper';
import FavoriteCard from '../../../../components/FavoriteCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import localStorageService from '../../../service/localStorageService';
import AsyncStorage from '@react-native-async-storage/async-storage';


const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2457C5',
  },
};

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
  'UFF Niterói',
  'UFF Petrópolis',
  'UFF Campos dos Goytacazes',
  'UFF Volta Redonda',
  'UFF Rio das Ostras',
  'UFF Angra dos Reis',
  'UFF Santo Antônio de Pádua',
  'UFF Nova Friburgo',
  'UFF Macaé',
  'UFF Miracema',
  'UFRJ Rio de Janeiro',
  'UFRJ Macaé',
  'UFRJ Duque de Caxias',
  'UFRJ Xerém',
  'UFRRJ Seropédica',
  'UFRRJ Nova Iguaçu',
  'UFRRJ Três Rios',
  'UNIRIO Rio de Janeiro',
  'IFRJ Rio de Janeiro (Realengo)',
  'IFRJ Rio de Janeiro (Maracanã)',
  'IFRJ Rio de Janeiro (Duque de Caxias)',
  'IFRJ Nilópolis',
  'IFRJ Engenheiro Paulo de Frontin',
  'IFRJ Paracambi',
  'IFRJ Volta Redonda',
  'IFRJ Pinheiral',
  'IFRJ Resende',
  'IFRJ São Gonçalo',
  'IFRJ Arraial do Cabo',
  'IFRJ Niterói',
  'UERJ Rio de Janeiro (Maracanã)',
  'UERJ São Gonçalo',
  'UERJ Duque de Caxias',
  'UERJ Resende',
  'UERJ Teresópolis',
  'UERJ Petrópolis',
  'CEFET Rio de Janeiro (Maracanã)',
  'CEFET Nova Iguaçu',
  'CEFET Petrópolis',
  'CEFET Angra dos Reis',
  'CEFET Itaguaí',
  'CEFET Maria da Graça (Rio de Janeiro)',
  'CEFET Valença'
];


function FavoritesScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = React.useState('');
  const [filterVisible, setFilterVisible] = React.useState(false);
  const [propertyType, setPropertyType] = React.useState('');
  const [state, setState] = React.useState('');
  const [city, setCity] = React.useState('');
  const [neighborhood, setNeighborhood] = React.useState('');
  const [nearbyCollege, setNearbyCollege] = React.useState('');
  const [propertyTypeMenuVisible, setPropertyTypeMenuVisible] = React.useState(false);
  const [stateMenuVisible, setStateMenuVisible] = React.useState(false);
  const [cityMenuVisible, setCityMenuVisible] = React.useState(false);
  const [collegeMenuVisible, setCollegeMenuVisible] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState(0);
  const [announcements, setAnnouncements] = React.useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = React.useState([]);
  const [visible, setVisible] = React.useState(false);
  const [id, setId] = React.useState(null);
  const hideModal = () => setVisible(false);
  const [storedUser, setStoredUser] = React.useState({});
  const [textoParaRemoverOuAdicionar, setTextoParaRemoverOuAdicionar] = React.useState("adicionar");

  async function fetchFavoriteAnnouncements() {
    const user = JSON.parse(await AsyncStorage.getItem('logged'));
    setStoredUser(user);

    const houses = await localStorageService.getAllItems('houses');
    const favoriteHouses = houses.filter(house => house.favoriteUsers && house.favoriteUsers.some(fav => fav.email === user.email));
    setAnnouncements(favoriteHouses);
    setFilteredAnnouncements(favoriteHouses);
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFavoriteAnnouncements();
    });

    return unsubscribe;
  }, [navigation]);

  const handleSearchSubmit = () => {
    Keyboard.dismiss();
    const searchLowerCase = search.toLowerCase();
    const filtered = announcements.filter(announcement =>
      (announcement.city && announcement.city.toLowerCase().includes(searchLowerCase)) ||
      (announcement.neighborhood && announcement.neighborhood.toLowerCase().includes(searchLowerCase)) ||
      (announcement.price && announcement.price.toString().includes(search))
    );
    setFilteredAnnouncements(filtered);
  };

  const applyFilters = () => {
    const filterCriteria = {
      propertyType,
      state,
      city,
      neighborhood,
      nearbyCollege,
      price: sliderValue,
    };

    const filtered = announcements.filter((announcement) => {
      return (
        (!filterCriteria.propertyType || announcement.propertyType === filterCriteria.propertyType) &&
        (!filterCriteria.state || announcement.state === filterCriteria.state) &&
        (!filterCriteria.city || announcement.city.toLowerCase() === filterCriteria.city.toLowerCase()) &&
        (!filterCriteria.nearbyCollege || announcement.neighborhood.toLowerCase().includes(filterCriteria.neighborhood.toLowerCase())) &&
        (!filterCriteria.nearbyCollege || announcement.nearbyCollege.toLowerCase().includes(filterCriteria.nearbyCollege.toLowerCase())) &&
        (announcement.price <= filterCriteria.price)
      );
    });

    setFilteredAnnouncements(filtered);
    setFilterVisible(false);
  };

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

  const showModal = () => {
    setVisible(true);
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

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.safeArea}>
        <ExpoStatusBar style="auto" />
        <View style={styles.headerContainer}>
          <View style={styles.section}>
            <Text style={styles.text}>Favoritos</Text>
            <TouchableOpacity onPress={() => setFilterVisible(true)}>
              <Icon name="filter" size={24} color="#1D3D4C" style={styles.filterIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
        </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={filteredAnnouncements.length === 0 ? styles.emptyScrollView : null}>
          {filteredAnnouncements.length === 0 ? (
            <Text style={styles.emptyText}>Sem favoritos registrados</Text>
          ) : (
            <View style={styles.cardsContainer}>
              {filteredAnnouncements.map((announcement, index) => (
                <FavoriteCard
                  nearbyCollege={announcement.nearbyCollege}
                  key={index}
                  id={announcement.id}
                  title={announcement.city}
                  value={announcement.price}
                  description={announcement.description.substring(0,50)+"..."}
                  icon="home"
                  imageSource={{ uri: announcement.images[0] }}
                  onPress={showModal}
                  setId={setId}
                  heartColor={checarFavorito(announcement)}
                  setTextoParaRemoverOuAdicionar={setTextoParaRemoverOuAdicionar}
                />
              ))}
            </View>
          )}
        </ScrollView>
        <Portal>
          <Modal visible={filterVisible} onDismiss={() => setFilterVisible(false)} contentContainerStyle={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Filtrar Imóveis</Text>
              <View style={[styles.dropdownContainer, styles.input]}>
                <Menu
                  visible={propertyTypeMenuVisible}
                  style={{ position: 'relative', top: 260, width: '70%' }}
                  onDismiss={() => setPropertyTypeMenuVisible(false)}
                  anchor={
                    <TouchableOpacity onPress={() => setPropertyTypeMenuVisible(true)} style={styles.menuButton}>
                      <Text style={styles.menuText}>{propertyType || 'Tipo de Imóvel'}</Text>
                      <Icon name="menu-down" size={24} color="#000" />
                    </TouchableOpacity>
                  }
                  contentStyle={styles.dropdownMenu}
                >
                  <Menu.Item onPress={() => { setPropertyType('Casa'); setPropertyTypeMenuVisible(false); }} title="Casa" />
                  <Menu.Item onPress={() => { setPropertyType('Kitnet'); setPropertyTypeMenuVisible(false); }} title="Kitnet" />
                  <Menu.Item onPress={() => { setPropertyType('Apartamento'); setPropertyTypeMenuVisible(false); }} title="Apartamento" />
                  <Menu.Item onPress={() => { setPropertyType('Imóvel Compartilhado'); setPropertyTypeMenuVisible(false); }} title="Imóvel Compartilhado" />
                </Menu>
              </View>

              <View style={[styles.dropdownContainer, styles.input]}>
                <Menu
                  style={{ position: 'relative', top: 220,  width: '70%' }}
                  visible={stateMenuVisible}
                  onDismiss={() => setStateMenuVisible(false)}
                  anchor={
                    <TouchableOpacity onPress={() => setStateMenuVisible(true)} style={styles.menuButton}>
                      <Text style={styles.menuText}>{state || 'Selecione o Estado'}</Text>
                      <Icon name="menu-down" size={24} color="#000" />
                    </TouchableOpacity>
                  }
                  contentStyle={styles.dropdownMenu}
                >
                  {STATES.map((state, index) => (
                    <Menu.Item key={index} onPress={() => { setState(state.value); setStateMenuVisible(false); }} title={state.label} />
                  ))}
                </Menu>
              </View>

              {state === 'RJ' && (
                <>
                  <View style={[styles.dropdownContainer, styles.input]}>
                    <Menu
                      visible={cityMenuVisible}
                      onDismiss={() => setCityMenuVisible(false)}
                      style={{ position: 'relative', top: 300,  width: '70%' }}
                      anchor={
                        <TouchableOpacity onPress={() => setCityMenuVisible(true)} style={styles.menuButton}>
                          <Text style={styles.menuText}>{city || 'Selecione a Cidade'}</Text>
                          <Icon name="menu-down" size={24} color="#000" />
                        </TouchableOpacity>
                      }
                      contentStyle={styles.dropdownMenu}
                    >
                      {CITIES_RJ.map((city, index) => (
                        <Menu.Item key={index} onPress={() => { setCity(city); setCityMenuVisible(false); }} title={city} />
                      ))}
                    </Menu>
                  </View>

                  <TextInput
                    label="Bairro"
                    value={neighborhood}
                    onChangeText={text => setNeighborhood(text)}
                    style={styles.input}
                  />

                  <View style={[styles.dropdownContainer, styles.input]}>
                    <Menu
                      visible={collegeMenuVisible}
                      style={{ position: 'relative', top: 300,  width: '70%' }}
                      onDismiss={() => setCollegeMenuVisible(false)}
                      anchor={
                        <TouchableOpacity onPress={() => setCollegeMenuVisible(true)} style={styles.menuButton}>
                          <Text style={styles.menuText}>{nearbyCollege || 'Selecione a Faculdade Próxima'}</Text>
                          <Icon name="menu-down" size={24} color="#000" />
                        </TouchableOpacity>
                      }
                      contentStyle={styles.dropdownMenu}
                    >
                      {COLLEGES_RJ.map((college, index) => (
                        <Menu.Item key={index} onPress={() => { setNearbyCollege(college); setCollegeMenuVisible(false); }} title={college} />
                      ))}
                    </Menu>
                  </View>
                </>
              )}

              <View style={styles.sliderContainer}>
                <Text>Valor do Imóvel: R$ {sliderValue}</Text>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0}
                  maximumValue={10000}
                  step={100}
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  minimumTrackTintColor="#2457C5"
                  maximumTrackTintColor="#000000"
                />
              </View>
              <Button mode="contained" onPress={applyFilters} style={styles.button}>
                Aplicar Filtros
              </Button>
            </ScrollView>
          </Modal>
        </Portal>
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
            <Text>Deseja {textoParaRemoverOuAdicionar} este anúncio dos favoritos?</Text>
            <View style={styles.modalButtons}>
              <Button onPress={hideModal} mode="contained" style={styles.modalButton}>Não</Button>
              <Button onPress={removeOrAddAnnouncement} mode="contained" style={styles.modalButton}>Sim</Button>
            </View>
          </Modal>
        </Portal>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  searchInputContainer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'white',
  },
  filterIcon: {
    position: 'absolute',
    right: 10,
    top: -10,
  },
  goBackIcon: {
    position: 'absolute',
    left: 16,
    top: 10,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 10,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  emptyScrollView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
  cardsContainer: {
    padding: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    flex: 1,
    textAlign: 'left',
    fontSize: 27,
    fontWeight: 'bold',
    color: '#333333',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  descriptionInput: {
    height: 100,
  },
  button: {
    marginVertical: 16,
  },
  sliderContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  modalButton: {
    marginHorizontal: 10,
  },
  menuButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 5,
    width: '100%'
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownMenu: {
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    marginTop: 0,
  },
});

export default FavoritesScreen;
