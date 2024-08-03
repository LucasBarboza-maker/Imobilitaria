import * as React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, SafeAreaView, Platform, TouchableOpacity, Keyboard } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Button, DefaultTheme, Provider as PaperProvider, Modal, Portal, TextInput, Menu } from 'react-native-paper';
import FavoriteCard from '../../components/FavoriteCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import localStorageService from '../service/localStorageService';
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
  { label: 'Rio de Janeiro', value: 'RJ' },
  { label: 'São Paulo', value: 'SP' },
  // Add other states here
];

const CITIES_RJ = [
  'Rio de Janeiro',
  'Niterói',
  'Petrópolis',
  // Add other cities in Rio de Janeiro here
];

const COLLEGES_RJ = [
  'Universidade Federal do Rio de Janeiro (UFRJ)',
  'Universidade do Estado do Rio de Janeiro (UERJ)',
  // Add other public universities in Rio de Janeiro here
];

function AnnouncementsScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const searchQuery = params.searchQuery;
  const [search, setSearch] = React.useState(searchQuery || '');
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
  const [sliderValue, setSliderValue] = React.useState(50000);
  const [announcements, setAnnouncements] = React.useState([]);
  const [visible, setVisible] = React.useState(false);
  const [id, setId] = React.useState(null);
  const hideModal = () => setVisible(false);
  const [storedUser, setStoredUser] = React.useState({});
  const [textoParaRemoverOuAdicionar, setTextoParaRemoverOuAdicionar] = React.useState("adicionar");

  async function fetchAnnouncements() {
    setStoredUser(JSON.parse(await AsyncStorage.getItem('logged')));
    const houses = await localStorageService.getAllItems('houses');
    setAnnouncements(houses);
    if (searchQuery && searchQuery.trim() !== '') {
      handleSearchSubmit(searchQuery, houses);
    }
  }

  React.useEffect(() => {
    fetchAnnouncements();
  }, [searchQuery]);

  const handleSearchSubmit = async (searchTerm, houses) => {
    Keyboard.dismiss();
    const searchValue = searchTerm || search;

    if (!houses) {
      houses = await localStorageService.getAllItems('houses');
    }

    if (searchValue.trim() === '') {
      setAnnouncements(houses);
      return;
    }

    const searchResults = houses.filter((announcement) =>
      String(announcement.city).toLowerCase().includes(searchValue.toLowerCase()) ||
      String(announcement.neighborhood).toLowerCase().includes(searchValue.toLowerCase()) ||
      String(announcement.price).includes(searchValue)
    );
    setAnnouncements(searchResults);
  };

  const applyFilters = async () => {
    const houses = await localStorageService.getAllItems('houses');
    const filterCriteria = {
      propertyType,
      state,
      city,
      neighborhood,
      nearbyCollege,
      price: sliderValue,
    };

    const filteredAnnouncements = houses.filter((announcement) => {
      return (
        (!filterCriteria.propertyType || announcement.propertyType === filterCriteria.propertyType) &&
        (!filterCriteria.state || announcement.state === filterCriteria.state) &&
        (!filterCriteria.city || announcement.city === filterCriteria.city) &&
        (!filterCriteria.neighborhood || announcement.neighborhood === filterCriteria.neighborhood) &&
        (!filterCriteria.nearbyCollege || announcement.nearbyCollege === filterCriteria.nearbyCollege) &&
        (announcement.price <= filterCriteria.price)
      );
    });

    setAnnouncements(filteredAnnouncements);
    setFilterVisible(false);
  };

  const resetFilters = () => {
    setPropertyType('');
    setState('');
    setCity('');
    setNeighborhood('');
    setNearbyCollege('');
    setSliderValue(50000);
  };

  const openFilterModal = () => {
    resetFilters();
    setFilterVisible(true);
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
    fetchAnnouncements();
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
          <View style={styles.searchInputContainer}>
            <TouchableOpacity onPress={openFilterModal}>
              <Icon name="filter" size={24} color="#1D3D4C" style={styles.filterIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
        </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={announcements.length === 0 ? styles.emptyScrollView : null}>
          {announcements.length === 0 ? (
            <Text style={styles.emptyText}>Sem anúncios registrados</Text>
          ) : (
            <View style={styles.cardsContainer}>
              {announcements.map((announcement, index) => (
                <FavoriteCard
                  key={index}
                  id={announcement.id}
                  title={announcement.city}
                  value={announcement.price}
                  description={announcement.description}
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

                  <View style={[styles.dropdownContainer, styles.input]}>
                    <Menu
                      visible={collegeMenuVisible}
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 10
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

export default AnnouncementsScreen;
