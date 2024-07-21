import * as React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { Button, TextInput } from 'react-native-paper';

function ForgotPasswordScreen({ }) {
  const navigation = useNavigation();
  const [email, setEmail] = React.useState('');

  const inputTheme = {
    colors: {
      placeholder: 'gray',
      primary: 'gray',
    },
  };

  return (
    <ImageBackground
      source={require('../../assets/images/login_bg_image.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/logo.png')} // Substitua pelo caminho da sua imagem de logo
          style={styles.logo}
        />
        <Text style={styles.text}>Recuperar Senha</Text>
        <Text style={styles.infoText}>Um e-mail de recuperação será enviado para seu endereço de e-mail cadastrado.</Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
          theme={inputTheme}
        />
        <Button
          mode="contained"
          onPress={() => navigation.navigate('login')}
          style={styles.button}
        >
          Voltar ao Login
        </Button>
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
  input: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
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
  infoText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    width: '100%',
    padding: 8,
    backgroundColor: '#4A90E2',
    fontSize: 40,
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

export default ForgotPasswordScreen;
