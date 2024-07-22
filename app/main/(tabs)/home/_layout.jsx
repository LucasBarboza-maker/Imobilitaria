import * as React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeCard from '../../../../components/HomeCard';

function HomeScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = React.useState('');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <ImageBackground
            source={require('../../../../assets/images/home_bg_image.png')} // Substitua pelo caminho da sua imagem
            style={styles.imageBackground}
            imageStyle={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }} // Adiciona borda arredondada na imagem
          >
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../../assets/images/logo.png')} // Substitua pelo caminho da sua imagem de logo
                style={styles.logo}
              />
              <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 16 }}>
                Imobiliária
              </Text>
              <View style={styles.searchInputContainer}>
                <TextInput
                  placeholder="Pesquise por acomodações"
                  value={search}
                  onChangeText={text => setSearch(text)}
                  style={styles.searchInput}
                />
                <Icon name="filter" size={24} color="#1D3D4C" style={styles.filterIcon} />
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
        <View>
          <Icon name="chevron-right" size={48} color="#00509E" style={styles.chevronIcon} />
        </View>
      </View>
      <View style={styles.divider} />
      <View>
        <View style={styles.advertiseContainer}>
          <Text style={{ color: 'black', fontSize: 20 }}>Últimas visualizações:</Text>
        </View>
        <ScrollView contentContainerStyle={styles.containerScroll} horizontal={true}>
          <HomeCard
            title="Title 1"
            value="$100"
            icon="home"
            padding={10}
            imageSource={require('../../../../assets/images/home_bg_image.png')}
          />
          <HomeCard
            title="Title 2"
            value="$200"
            icon="star"
            padding={10}
            imageSource={require('../../../../assets/images/home_bg_image.png')} // Substitua pelo caminho da sua imagem
          />
          <HomeCard
            title="Title 3"
            value="$300"
            icon="heart"
            padding={10}
            imageSource={require('../../../../assets/images/home_bg_image.png')} // Substitua pelo caminho da sua imagem
          />
        </ScrollView>
      </View>
    </ScrollView>
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
    height: 500, // Ajuste a altura conforme necessário
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
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 15,
    paddingRight: 40,
    color: 'black',
    backgroundColor: 'white',
  },
  filterIcon: {
    position: 'absolute',
    right: 10,
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
});

export default HomeScreen;
