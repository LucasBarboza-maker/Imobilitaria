import * as React from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Button, DefaultTheme, Provider as PaperProvider, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
  const [email, setEmail] = React.useState('');
  const [celular, setCelular] = React.useState('');
  const [emailValid, setEmailValid] = React.useState(true);
  const [celularValid, setCelularValid] = React.useState(true);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

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

  const handleSave = () => {
    const isEmailValid = validateEmail(email);
    const isCelularValid = validateCelular(celular);

    setEmailValid(isEmailValid);
    setCelularValid(isCelularValid);

    if (isEmailValid && isCelularValid) {
      console.log({ nome, email, celular });
    } else {
      console.log("Invalid email or celular!");
    }
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.safeArea}>
        <ExpoStatusBar style="auto" />
        <View style={styles.headerContainer}>
          <View style={styles.section}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
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
            mode="outlined"
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={text => {
              setEmail(text);
              setEmailValid(validateEmail(text));
            }}
            style={[styles.input, !emailValid && styles.errorInput]}
            mode="outlined"
            keyboardType="email-address"
            error={!emailValid}
          />
          {!emailValid && (
            <Text style={styles.errorText}>Email inválido</Text>
          )}
          <TextInput
            label="Celular"
            value={celular}
            onChangeText={text => handleCelularChange(text)}
            style={[styles.input, !celularValid && styles.errorInput]}
            mode="outlined"
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
    color: '#333333',
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
