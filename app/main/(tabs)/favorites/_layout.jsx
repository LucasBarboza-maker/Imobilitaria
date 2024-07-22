import * as React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, SafeAreaView, Platform } from 'react-native';
import { useNavigation } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Button, DefaultTheme, Provider as PaperProvider, Modal, Portal } from 'react-native-paper';
import FavoriteCard from '../../../../components/FavoriteCard';

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
  const [announcements, setAnnouncements] = React.useState([
    {
      id:"asokdfnasofgasofn",
      title: "Ilha do Governador - RJ",
      value: "10000",
      description: "Casa bem localizada, situada em uma área repleta de comodidades e conveniências. A região é extremamente...",
      icon: "home",
      imageSource: require('../../../../assets/images/home_bg_image.png'),
    },
    {
      id:"aspfgokmasgokisang",
      title: "Ilha do Governador - RJ",
      value: "10000",
      description: "Casa bem localizada, situada em uma área repleta de comodidades e conveniências. A região é extremamente...",
      icon: "home",
      imageSource: require('../../../../assets/images/home_bg_image.png'),
    }
  ]);

  const [visible, setVisible] = React.useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = React.useState(null);

  const showModal = (announcement) => {
    console.log("teste");
    setSelectedAnnouncement(announcement);
    setVisible(true);
  };

  const hideModal = () => setVisible(false);

  const removeAnnouncement = () => {
    setAnnouncements(announcements.filter(a => a !== selectedAnnouncement));
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
                <FavoriteCard
                  key={index}
                  id={announcement.id}
                  title={announcement.title}
                  value={announcement.value}
                  description={announcement.description}
                  icon={announcement.icon}
                  imageSource={announcement.imageSource}
                  onPress={() => showModal(announcement)}
                />
              ))}
            </View>
          )}
        </ScrollView>
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
            <Text>Deseja remover este anúncio?</Text>
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
