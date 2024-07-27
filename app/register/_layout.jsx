import * as React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import localStorageService from '../../service/localStorageService';

function RegisterScreen() {
  const navigation = useNavigation();
  const [name, setName] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordStrength, setPasswordStrength] = React.useState(0);
  const [strengthLegend, setStrengthLegend] = React.useState('');

  const inputTheme = {
    colors: {
      placeholder: 'gray',
      primary: 'gray',
    },
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    if(strength == 0) setStrengthLegend("Fraca: utilize letras maisuculas e caracteres especiais");
    if(strength == 25) setStrengthLegend("Fraca: utilize letras maisuculas e caracteres especiais");
    if(strength == 50) setStrengthLegend("Media: utilize letras maisuculas e caracteres especiais");
    if(strength == 100) setStrengthLegend("Forte");

    console.log(strength);

    return strength;
  };

  const handlePasswordChange = (password) => {
    setPassword(password);
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      surname,
      email,
      phone,
      password,
    };

    try {
      const users = await localStorageService.getAllItems('users');
      const existingUser = users.find(user => user.email === email);

      if (existingUser) {
        alert('Este email já está registrado');
        return;
      }

      await localStorageService.saveItem('users', newUser);
      navigation.navigate('main/(tabs)');
    } catch (error) {
      console.error('Erro ao registrar usuário', error);
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
        <Text style={styles.text}>Registrar</Text>
        <TextInput
          label="Nome"
          value={name}
          onChangeText={text => setName(text)}
          style={styles.input}
          theme={inputTheme}
        />
        <TextInput
          label="Sobrenome"
          value={surname}
          onChangeText={text => setSurname(text)}
          style={styles.input}
          theme={inputTheme}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
          theme={inputTheme}
        />
        <TextInput
          label="Telefone"
          value={phone}
          onChangeText={text => setPhone(text)}
          style={styles.input}
          theme={inputTheme}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            label="Senha"
            value={password}
            onChangeText={text => handlePasswordChange(text)}
            secureTextEntry={!showPassword}
            style={[styles.input, { flex: 1, marginBottom: 8 }]}
            theme={inputTheme}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>
        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', justifyContent: 'space-between', height: 16 }}>
          {passwordStrength >= 25 ? <View style={{ width: '23%', height: 8, backgroundColor: 'red' }}></View> : <View style={{ width: '23%', height: 8, backgroundColor: 'gray' }}></View>}
          {passwordStrength >= 50 ? <View style={{ width: '23%', height: 8, backgroundColor: 'yellow' }}></View> : <View style={{ width: '23%', height: 8, backgroundColor: 'gray' }}></View>}
          {passwordStrength >= 75 ? <View style={{ width: '23%', height: 8, backgroundColor: 'yellow' }}></View> : <View style={{ width: '23%', height: 8, backgroundColor: 'gray' }}></View>}
          {passwordStrength == 100 ? <View style={{ width: '23%', height: 8, backgroundColor: 'green' }}></View> : <View style={{ width: '23%', height: 8, backgroundColor: 'gray' }}></View>}
        </View>
        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', justifyContent: 'space-between', height: 16, marginBottom: 16 }}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, width: '100%' }}>
            {strengthLegend}
          </Text>
        </View>
        <TextInput
          label="Confirmar Senha"
          value={confirmPassword}
          onChangeText={text => setConfirmPassword(text)}
          secureTextEntry
          style={styles.input}
          theme={inputTheme}
        />
        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.button}
        >
          Registrar
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate('login')}>
          <Text style={styles.loginText}>Já tem uma conta? Acesse</Text>
        </TouchableOpacity>
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
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    padding: 8,
    backgroundColor: '#4A90E2',
    fontSize: 40,
  },
  loginText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 16,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
