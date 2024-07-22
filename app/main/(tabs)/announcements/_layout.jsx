import * as React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, SafeAreaView, Platform } from 'react-native';
import { useNavigation } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Button, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import AnnouncementCard from '../../../../components/AnnouncementCard';
import storageService from '../../../../service/storageService' // Ensure the correct path to storageService

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
  const [announcements, setAnnouncements] = React.useState([]);

  React.useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const storedHouses = await storageService.get('houses') || [];
        setAnnouncements(storedHouses);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.safeArea}>
        <ExpoStatusBar style="auto" />
        <View style={styles.headerContainer}>
          <View style={styles.section}>
            <Text style={styles.text}>Anúncios</Text>
            <Button mode="contained" onPress={() => navigation.navigate('create-house')}>
              Criar
            </Button>
          </View>
          <View style={styles.divider} />
        </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={announcements.length === 0 ? styles.emptyScrollView : null}>
          {announcements.length === 0 ? (
            <Text style={styles.emptyText}>Sem anúncios registrados</Text>
          ) : (
            <View style={styles.cardsContainer}>
              {announcements.map((announcement, index) => (
                <AnnouncementCard
                  key={index}
                  title={announcement.city}
                  value={announcement.value}
                  description={announcement.description}
                  icon="home" // assuming 'home' as a generic icon
                  imageSource={announcement.images.length > 0 ? { uri: announcement.images[0] } : require('../../../../assets/images/home_bg_image.png')}
                />
              ))}
            </View>
          )}
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
});

export default AnnouncementsScreen;
