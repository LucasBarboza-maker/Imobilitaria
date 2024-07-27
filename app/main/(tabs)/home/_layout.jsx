import * as React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { useNavigation } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeCard from '../../../../components/HomeCard';
import { Button, DefaultTheme, Provider as PaperProvider, Modal, Portal, TextInput, Menu, Divider } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import localStorageService from '../../../service/localStorageService';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2457C5',
  },
};

function HomeScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = React.useState('');
  const [filterVisible, setFilterVisible] = React.useState(false);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState(50000);
  const [propertyType, setPropertyType] = React.useState('');
  const [city, setCity] = React.useState('');
  const [neighborhood, setNeighborhood] = React.useState('');
  const [nearbyCollege, setNearbyCollege] = React.useState('');
  const [featuredHouses, setFeaturedHouses] = React.useState([]);

  React.useEffect(() => {
    const fetchFeaturedHouses = async () => {
      const houses = await localStorageService.getAllItems('houses');
      setFeaturedHouses(houses.slice(0, 5)); // Show the first 5 houses as featured
    };

    fetchFeaturedHouses();
  }, []);

  const handleSearchSubmit = () => {
    Keyboard.dismiss();
    navigation.navigate('house-list', { searchQuery: search });
  };

  const applyFilters = () => {
    setFilterVisible(false);
    const filterCriteria = {
      propertyType,
      price: sliderValue,
      city,
      neighborhood,
      nearbyCollege,
    };
    navigation.navigate('house-list', { filters: filterCriteria });
  };

  return (
    <PaperProvider theme={theme}>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <ImageBackground
              source={require('../../../../assets/images/home_bg_image.png')}
              style={styles.imageBackground}
              imageStyle={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
            >
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../../../assets/images/logo.png')}
                  style={styles.logo}
                />
                <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 16 }}>
                  Imobiliária
                </Text>
                <View style={styles.searchInputContainer}>
                  <Icon name="magnify" size={24} color="#1D3D4C" style={styles.searchIcon} />
                  <TextInput
                    placeholder="Pesquise por acomodações"
                    placeholderTextColor="#aaaaaa"
                    value={search}
                    onChangeText={text => setSearch(text)}
                    onSubmitEditing={handleSearchSubmit}
                    style={styles.searchInput}
                  />
                  <TouchableOpacity onPress={() => setFilterVisible(true)}>
                    <Icon name="filter" size={24} color="#1D3D4C" style={styles.filterIcon} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ width: '70%', paddingHorizontal: 20, height: '25%', alignContent: 'flex-end', justifyContent: 'flex-end' }}>
                <Text style={{ color: 'white', fontSize: 32 }}>
                  Hospede-se pertinho da sua <Text style={{ fontWeight: 'bold' }}>Faculdade</Text>
                </Text>
              </View>
            </ImageBackground>
          </View>
        </View>
        <View style={styles.advertiseContainer}>
          <View style={{ width: '70%' }}>
            <Text style={{ color: 'black', fontSize: 26 }}>
              <Text style={{ fontWeight: 'bold' }}>Anuncie</Text> seu imóvel e faça uma renda <Text style={{ fontWeight: 'bold' }}>extra!</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('create-house')}>
            <Icon name="chevron-right" size={48} color="#00509E" style={styles.chevronIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View>
          <View style={styles.advertiseContainer}>
            <Text style={{ color: 'black', fontSize: 20 }}>Últimas visualizações:</Text>
          </View>
          <ScrollView contentContainerStyle={styles.containerScroll} horizontal={true}>
            {featuredHouses.map((house, index) => (
              <TouchableOpacity key={index} onPress={() => navigation.navigate('house-details', { houseId: house.id })}>
                <HomeCard
                  title={house.city}
                  value={`R$ ${house.price}`}
                  icon="home"
                  padding={10}
                  imageSource={{ uri: house.images[0] }}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
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
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerScroll: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imageContainer: {
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
  },
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
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'black',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    color: 'black',
    backgroundColor: 'white',
  },
  filterIcon: {
    position: 'absolute',
    right: 10,
    top: -10
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 10,
  },
  advertiseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    padding: 10,
    alignItems: 'center',
  },
  chevronIcon: {
    marginLeft: 10,
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: '#6D6D6D',
    marginTop: 10,
    alignSelf: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
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
});

export default HomeScreen;
