import * as React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Button, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import AnnouncementCard from '../../../../components/AnnouncementCard';
import localStorageService from '../../../service/localStorageService';
import { useFocusEffect } from '@react-navigation/native';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2457C5',
  },
};

function UserAnnouncementsScreen() {
  const navigation = useNavigation();
  const [announcements, setAnnouncements] = React.useState([]);

  const fetchUserAnnouncements = async () => {
    const loggedUser = await localStorageService.getAllItems('logged');
    if (loggedUser.length === 0) {
      return;
    }

    const houses = await localStorageService.getAllItems('houses');
    const userAnnouncements = houses.filter(house => house.announcer.id === loggedUser[0].id);
    setAnnouncements(userAnnouncements);
  };

  useFocusEffect (() => {
    fetchUserAnnouncements();
  });

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.safeArea}>
        <ExpoStatusBar style="auto" />
        <View style={styles.headerContainer}>
          <View style={styles.section}>
            <Text style={styles.text}>Meus Anúncios</Text>
            <Button mode="contained" onPress={() => { navigation.navigate('create-house') }}>
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
                <TouchableOpacity
                  key={index}
                  onPress={() => navigation.navigate('house-details', { houseId: announcement.id })}
                >
                  <AnnouncementCard
                    nearbyCollege={announcement.nearbyCollege}
                    title={announcement.city}
                    value={announcement.price}
                    description={announcement.description}
                    icon="home"
                    imageSource={{ uri: announcement.images[0] }}
                    id={announcement.id}
                    refresh={fetchUserAnnouncements}
                    navigation={navigation}
                  />
                </TouchableOpacity>
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

export default UserAnnouncementsScreen;
