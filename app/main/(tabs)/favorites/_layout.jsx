import * as React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Button, DefaultTheme, Provider as PaperProvider, Modal, Portal } from 'react-native-paper';
import FavoriteCard from '../../../../components/FavoriteCard';
import localStorageService from '../../../../service/localStorageService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
  const [announcements, setAnnouncements] = React.useState([]);
  const [visible, setVisible] = React.useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = React.useState(null);

  React.useEffect(() => {
    const fetchFavorites = async () => {
      const loggedUser = await localStorageService.getAllItems('logged');
      if (loggedUser.length === 0) {
        return;
      }

      const houses = await localStorageService.getAllItems('houses');
      const userFavorites = houses.filter(house => 
        house.favorites && house.favorites.some(user => user.id === loggedUser[0].id)
      );
      setAnnouncements(userFavorites);
    };

    fetchFavorites();
  }, []);

  const showModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setVisible(true);
  };

  const hideModal = () => setVisible(false);

  const removeAnnouncement = async () => {
    const updatedAnnouncements = announcements.filter(a => a.id !== selectedAnnouncement.id);
    setAnnouncements(updatedAnnouncements);

    const houses = await localStorageService.getAllItems('houses');
    const updatedHouses = houses.map(h => {
      if (h.id === selectedAnnouncement.id) {
        return {
          ...h,
          favorites: h.favorites.filter(user => user.id !== loggedUser[0].id)
        };
      }
      return h;
    });
    await localStorageService.setItem('houses', JSON.stringify(updatedHouses));

    hideModal();
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.safeArea}>
        <ExpoStatusBar style="auto" />
        <View style={styles.headerContainer}>
          <View style={styles.section}>
            <Text style={styles.text}>Favoritos</Text>
          </View>
          <View style={styles.divider} />
        </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={announcements.length === 0 ? styles.emptyScrollView : null}>
          {announcements.length === 0 ? (
            <Text style={styles.emptyText}>Sem anúncios registrados</Text>
          ) : (
            <View style={styles.cardsContainer}>
              {announcements.map((announcement, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => showModal(announcement)}
                >
                  <FavoriteCard
                    id={announcement.id}
                    title={announcement.city}
                    value={announcement.price}
                    description={announcement.description}
                    icon="home"
                    imageSource={{ uri: announcement.images[0] }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
            <Text>Deseja remover este anúncio dos favoritos?</Text>
            <View style={styles.modalButtons}>
              <Button onPress={hideModal} mode="contained" style={styles.modalButton}>Não</Button>
              <Button onPress={removeAnnouncement} mode="contained" style={styles.modalButton}>Sim</Button>
            </View>
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

export default FavoritesScreen;
