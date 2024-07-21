import * as React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TextInput, Button } from 'react-native';
import { useNavigation } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function HomeScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = React.useState('');

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageBackground
          source={require('../../../../assets/images/home_bg_image.png')} // Substitua pelo caminho da sua imagem
          style={styles.imageBackground}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../../assets/images/logo.png')} // Substitua pelo caminho da sua imagem de logo
              style={styles.logo}
            />
            <View style={styles.searchInputContainer}>
              <TextInput
                placeholder="Pesquisar"
                value={search}
                onChangeText={text => setSearch(text)}
                style={styles.searchInput}
                placeholderTextColor="#fff"
              />
              <Icon name="filter" size={24} color="#fff" style={styles.filterIcon} />
            </View>
          </View>
        </ImageBackground>
        <View style={styles.imageBorder} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Home Screen</Text>
        <Button
          title="Go to Details"
          onPress={() => navigation.navigate('login')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    height: '60%', // Ocupa mais da metade da tela vertical
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

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
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 15,
    paddingRight: 40,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterIcon: {
    position: 'absolute',
    right: 10,
  },
  imageBorder: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
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
});

export default HomeScreen;