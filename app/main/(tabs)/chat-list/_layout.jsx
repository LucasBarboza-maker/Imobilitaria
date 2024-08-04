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
import MessageCard from '../../../../components/ChatMessageCard';

// Create a custom theme
const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#2457C5',
    },
};


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
                (!filterCriteria.neighborhood || announcement.neighborhood.toLowerCase() === filterCriteria.neighborhood.toLowerCase()) &&
                (!filterCriteria.nearbyCollege || announcement.nearbyCollege.toLowerCase() === filterCriteria.nearbyCollege.toLowerCase()) &&
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

    const fakeConversations = [
        { 
          conversatorName: 'Marcelo', 
          hour: '10:30 AM', 
          lastMessage: 'O aluguel é R$ 1.200 por mês.', 
          messages: [
            { user: 'Você', text: 'Olá Marcelo, a casa está disponível?' },
            { user: 'Marcelo', text: 'Olá! está disponível sim' },
            { user: 'Você', text: 'Qual é o valor do aluguel?' },
            { user: 'Marcelo', text: 'O aluguel é R$ 1.200 por mês.' }
          ]
        },
        { 
          conversatorName: 'João', 
          hour: '09:15 AM', 
          lastMessage: 'O apartamento fica no centro, perto de vários comércios.', 
          messages: [
            { user: 'Você', text: 'Oi João, estou interessado no apartamento que você anunciou.' },
            { user: 'João', text: 'Claro, posso te ajudar com algo específico?' },
            { user: 'Você', text: 'Gostaria de saber mais sobre a localização.' },
            { user: 'João', text: 'O apartamento fica no centro, perto de vários comércios.' }
          ]
        },
        { 
          conversatorName: 'Maria', 
          hour: 'Ontem', 
          lastMessage: 'Sim, combinado. Obrigado pela informação!', 
          messages: [
            { user: 'Você', text: 'Oi Maria, você recebeu meu email?' },
            { user: 'Maria', text: 'Sim, recebi. O imóvel ainda está disponível.' },
            { user: 'Você', text: 'Perfeito, posso agendar uma visita?' },
            { user: 'Maria', text: 'Claro, qual seria o melhor horário para você?' },
            { user: 'Você', text: 'Pode ser amanhã às 14h?' },
            { user: 'Maria', text: 'Sim, combinado. Obrigado pela informação!' }
          ]
        },
      ];


    return (
        <PaperProvider theme={theme}>
            <SafeAreaView style={styles.safeArea}>
                <ExpoStatusBar style="auto" />
                <View style={styles.headerContainer}>
                    <View style={styles.section}>
                        <Text style={styles.text}>Lista de Conversas</Text>
                        {/* <TouchableOpacity onPress={() => setFilterVisible(true)}>
                            <Icon name="filter" size={24} color="#1D3D4C" style={styles.filterIcon} />
                        </TouchableOpacity> */}
                    </View>
                    <View style={styles.divider} />
                </View>
                <ScrollView style={styles.scrollView}>
                    {fakeConversations.map((conversation, index) => (
                        <MessageCard
                            key={index}
                            conversatorName={conversation.conversatorName}
                            hour={conversation.hour}
                            lastMessage={conversation.lastMessage}
                            messages={JSON.stringify(conversation.messages)}
                        />
                    ))}
                </ScrollView>
            </SafeAreaView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        padding: 16,
        backgroundColor: '#2457C5',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    scrollView: {
        flex: 1,
        padding: 16,
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
