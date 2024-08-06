import * as React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import { TextInput, Button, Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import localStorageService from './service/localStorageService';
import AsyncStorage from '@react-native-async-storage/async-storage';

console.disableYellowBox = true;

function LoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [stayConnected, setStayConnected] = React.useState(false);

  React.useEffect(() => {
    localStorageService.initializeData();

    const loadStoredCredentials = async () => {
      try {
        const storedUser = JSON.parse(await AsyncStorage.getItem('logged'));

        if (storedUser) {
          setUsername(storedUser.email);
          setPassword(storedUser.password);
          setStayConnected(true);
        }
      } catch (error) {
        console.error('Error loading stored credentials', error);
      }
    };

    loadStoredCredentials();
  }, []);

  const inputTheme = {
    colors: {
      placeholder: 'gray',
      primary: 'gray',
    },
  };

  const handleLogin = async () => {
    try {
      const users = await localStorageService.getAllItems('users');
      const user = users.find(user => user.email === username && user.password === password);

      if (user) {
        if (true) {

          // await localStorageService.deleteAllItems('logged');
          await AsyncStorage.setItem('logged', JSON.stringify({ email: username, password }));
          // await localStorageService.saveItem('logged', user);
        } else {
          await AsyncStorage.removeItem('logged');
        }
        navigation.navigate('main/(tabs)');
      } else {
        Alert.alert('Erro', 'Email ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro ao fazer login', error);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/login_bg_image.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.text}>Imobilitária</Text>
        <TextInput
          label="Email"
          value={username}
          onChangeText={text => setUsername(text)}
          style={styles.input}
          theme={inputTheme}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            label="Senha"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={!showPassword}
            style={[styles.input, { flex: 1 }]}
            theme={inputTheme}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>
        <View style={styles.checkboxContainer}>
          <Checkbox
            onPress={() => setStayConnected(!stayConnected)}
            status={stayConnected ? 'checked' : 'unchecked'}
            color="white"
            uncheckedColor='white'
          />
          <Text style={styles.checkboxLabel}>Manter-me conectado</Text>
        </View>
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
        >
          Entrar
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate('forgot-password')}>
          <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('register')}>
            <Text style={styles.registerText}>Não tem uma conta? Registre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  text: {
    color: 'white',
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  eyeIcon: {
    padding: 8,
    position: 'absolute',
    right: 0,
    top: '30%',
    transform: [{ translateY: -12 }]
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxLabel: {
    color: 'white',
    marginLeft: 8,
  },
  button: {
    width: '100%',
    padding: 8,
    backgroundColor: '#4A90E2',
    fontSize: 40,
  },
  forgotPassword: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 16,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
