import * as React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, ToastAndroid, Animated } from 'react-native';
import { useNavigation } from 'expo-router';
import { Button, TextInput } from 'react-native-paper';
import localStorageService from '../service/localStorageService';

const CustomToast = ({ visible, message }) => {
  const [showToast, setShowToast] = React.useState(visible);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      setShowToast(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setShowToast(false));
      }, 10000); // Display toast for 10 seconds
    }
  }, [visible, fadeAnim]);

  if (!showToast) {
    return null;
  }

  return (
    <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
      <Text style={styles.toastMessage}>{message}</Text>
    </Animated.View>
  );
};

function ForgotPasswordScreen({ }) {
  const navigation = useNavigation();
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [showCodeInput, setShowCodeInput] = React.useState(false);
  const [generatedCode, setGeneratedCode] = React.useState('');
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');

  const inputTheme = {
    colors: {
      placeholder: 'gray',
      primary: 'gray',
    },
  };

  const generateRandomCode = async () => {

    const users = await localStorageService.getAllItems('users');
    const user = users.find(user => user.email === email);

    if (!user) {
      setToastMessage('Usuário não encontrado');
      setShowToast(true);
      return;
    }

    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(randomCode);
    setToastMessage(`Your code is: ${randomCode}`);
    setShowToast(true);
    setShowCodeInput(true);
  };

  const handleSendCode = async () => {
    if (code === generatedCode) {
      navigation.navigate('change-password-settings-from-login', {email:email}); // Navigate to "alterar-senha" route
    } else {
      setToastMessage('Incorrect code. Please try again.');
      setShowToast(true);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/login_bg_image.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.text}>Recuperar Senha</Text>
        <Text style={styles.infoText}>
          {showCodeInput ? 'Digite o código enviado para seu e-mail.' : 'Um e-mail de recuperação será enviado para seu endereço de e-mail cadastrado.'}
        </Text>
        {showCodeInput ? (
          <TextInput
            label="Código"
            value={code}
            onChangeText={text => setCode(text)}
            style={styles.input}
            theme={inputTheme}
            keyboardType="numeric"
          />
        ) : (
          <TextInput
            label="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
            theme={inputTheme}
          />
        )}
        <Button
          mode="contained"
          onPress={showCodeInput ? handleSendCode : generateRandomCode}
          style={styles.button}
        >
          {showCodeInput ? 'Enviar' : 'Enviar código'}
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('index')}
          style={{ ...styles.button, marginTop: 50 }}
        >
          Voltar ao Login
        </Button>
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('register')}>
            <Text style={styles.registerText}>Não tem uma conta? Registre-se</Text>
          </TouchableOpacity>
        </View>
        <CustomToast visible={showToast} message={toastMessage} />
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
    marginBottom: 10,
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
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 50,
    right: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  toastMessage: {
    color: 'white',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
