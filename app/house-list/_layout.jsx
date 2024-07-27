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

// Create a custom theme
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2457C5',
  },
};

function AnnouncementsScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const searchQuery = params.searchQuery;
  const [search, setSearch] = React.useState(searchQuery || '');
  const [filterVisible, setFilterVisible] = React.useState(false);
  const [propertyType, setPropertyType] = React.useState('');
  const [city, setCity] = React.useState('');
  const [neighborhood, setNeighborhood] = React.useState('');
  const [nearbyCollege, setNearbyCollege] = React.useState('');
  const [menuVisible, setMenuVisible] = React.useState(false);
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
      city,
      neighborhood,
      nearbyCollege,
      price: sliderValue,
    };

    const filteredAnnouncements = houses.filter((announcement) => {
      return (
        (!filterCriteria.propertyType || announcement.propertyType === filterCriteria.propertyType) &&
        (!filterCriteria.city || announcement.city === filterCriteria.city) &&
        (!filterCriteria.neighborhood || announcement.neighborhood === filterCriteria.neighborhood) &&
        (!filterCriteria.nearbyCollege || announcement.nearbyCollege === filterCriteria.nearbyCollege) &&
        (Math.abs(announcement.price - filterCriteria.price) <= 1000)
      );
    });

    setAnnouncements(filteredAnnouncements);
    setFilterVisible(false);
  };

  const resetFilters = () => {
    setPropertyType('');
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackIcon}>
            <Icon name="arrow-left" size={24} color="#1D3D4C" />
          </TouchableOpacity>
          <View style={styles.searchInputContainer}>
            <Icon name="magnify" size={24} color="#1D3D4C" style={styles.searchIcon} />
            <TextInput
              placeholder="Pesquise por acomodações"
              placeholderTextColor="#aaaaaa"
              value={search}
              onChangeText={text => setSearch(text)}
              onSubmitEditing={() => handleSearchSubmit()}
              style={styles.searchInput}
            />
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
              <View style={styles.dropdownContainer}>
                <Menu
                  visible={menuVisible}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <TouchableOpacity onPress={() => setMenuVisible(true)}>
                      <TextInput
                        label="Tipo de Imóvel"
                        value={propertyType}
                        style={styles.input}
                        editable={false}
                        right={<TextInput.Icon name="menu-down" />}
                      />
                    </TouchableOpacity>
                  }
                >
                  <Menu.Item onPress={() => { setPropertyType('Casa'); setMenuVisible(false); }} title="Casa" />
                  <Menu.Item onPress={() => { setPropertyType('Kitnet'); setMenuVisible(false); }} title="Kitnet" />
                  <Menu.Item onPress={() => { setPropertyType('Apartamento'); setMenuVisible(false); }} title="Apartamento" />
                  <Menu.Item onPress={() => { setPropertyType('Imóvel Compartilhado'); setMenuVisible(false); }} title="Imóvel Compartilhado" />
                </Menu>
              </View>
              <View style={styles.sliderContainer}>
                <Text>Valor do Imóvel: R$ {sliderValue}</Text>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0}
                  maximumValue={100000}
                  step={1000}
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  minimumTrackTintColor="#2457C5"
                  maximumTrackTintColor="#000000"
                />
              </View>
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
});

export default AnnouncementsScreen;
