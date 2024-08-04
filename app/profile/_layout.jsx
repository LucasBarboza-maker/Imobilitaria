import * as React from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView, Platform, TouchableOpacity, ToastAndroid, ImageBackground } from 'react-native';
import { useNavigation } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Button, DefaultTheme, Provider as PaperProvider, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import localStorageService from '../service/localStorageService';

// Create a custom theme
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2457C5',
  },
};

function Settings() {
  const navigation = useNavigation();
  const [nome, setNome] = React.useState('');
  const [sobrenome, setSobreNome] = React.useState('');
  const [celular, setCelular] = React.useState('');
  const [celularValid, setCelularValid] = React.useState(true);
  const [username, setUsername] = React.useState();

  React.useEffect(() => {
    const loadStoredCredentials = async () => {
      try {
        const storedUser = JSON.parse(await AsyncStorage.getItem('logged'));
        if (storedUser) {
          const users = await localStorageService.getAllItems('users');
          const user = users.find(user => user.email === storedUser.email);

          setNome(user.name);
          setSobreNome(user.surname);
          handleCelularChange(user.phone);

          setUsername(storedUser.email);
        }
      } catch (error) {
        console.error('Error loading stored credentials', error);
      }
    };

    loadStoredCredentials();
  }, []);

  const validateCelular = (celular) => {
    const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
    return regex.test(celular);
  };

  const handleCelularChange = (text) => {
    // Basic mask for celular input
    const cleaned = ('' + text).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      const masked = `(${match[1]}) ${match[2]}-${match[3]}`;
      setCelular(masked);
      setCelularValid(validateCelular(masked));
    } else {
      setCelular(text);
      setCelularValid(false);
    }
  };

  const handleSave = async () => {
    const isCelularValid = validateCelular(celular);

    setCelularValid(isCelularValid);

    if (isCelularValid) {
      const users = await localStorageService.getAllItems('users');
      const user = users.find(user => user.email === username);

      user.phone = celular.replace(/\D/g, '');
      user.name = nome;
      user.surname = sobrenome;

      localStorageService.updateUserItem('users', user.email, user);

      ToastAndroid.show('Sucesso ao alterar informações', ToastAndroid.SHORT);
      setTimeout(() => {
        navigation.goBack();
      }, 100);
    } else {
      console.log("Celular inválido!");
    }
  };

  return (
    <PaperProvider theme={theme}>
      <ImageBackground source={require('../../assets/images/inner-cozy.png')} style={styles.backgroundImage}>
        <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.8)']} style={styles.gradient}>
          <SafeAreaView style={styles.safeArea}>
            <ExpoStatusBar style="auto" />
            <View style={styles.headerContainer}>
              <View style={styles.section}>
                <Text style={styles.text}>Dados Pessoais</Text>
              </View>
              <View style={styles.divider} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                label="Nome"
                value={nome}
                onChangeText={text => setNome(text)}
                style={styles.input}
                mode="flat"
              />
              <TextInput
                label="Sobrenome"
                value={sobrenome}
                onChangeText={text => setSobreNome(text)}
                style={styles.input}
                mode="flat"
              />
              <TextInput
                label="Celular"
                value={celular}
                onChangeText={text => handleCelularChange(text)}
                style={[styles.input, !celularValid && styles.errorInput]}
                mode="flat"
                keyboardType="phone-pad"
                error={!celularValid}
              />
              {!celularValid && (
                <Text style={styles.errorText}>Celular inválido</Text>
              )}
              <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                Salvar
              </Button>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  gradient: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: 'transparent',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  inputContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 16,
  },
  text: {
    flex: 1,
    textAlign: 'left',
    fontSize: 27,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  backButton: {
    marginRight: 16,
  },
});

export default Settings;
