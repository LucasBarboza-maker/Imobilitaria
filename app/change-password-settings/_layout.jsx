import * as React from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView, Platform, TouchableOpacity, ToastAndroid } from 'react-native';
import { useNavigation } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Button, DefaultTheme, Provider as PaperProvider, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import localStorageService from '../service/localStorageService';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2457C5',
  },
};

function ChangePasswordScreen() {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
  const [passwordsMatch, setPasswordsMatch] = React.useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = React.useState(false);

  React.useEffect(() => {
    setPasswordsMatch(newPassword === confirmNewPassword);
  }, [newPassword, confirmNewPassword]);

  const handleChangePassword = async () => {
    if (!passwordsMatch) {
      ToastAndroid.show('A nova senha não combina', ToastAndroid.SHORT);
      return;
    }

    const storedUser = JSON.parse(await AsyncStorage.getItem('logged'));
    
    if (storedUser) {
      const users = await localStorageService.getAllItems('users');
      const user = users.find(user => user.email === storedUser.email);

      if(user.password != currentPassword){
        ToastAndroid.show('Senha antiga incorreta!!', ToastAndroid.SHORT);
        return; 
      }

      user.password = newPassword;

      
      localStorageService.updateUserItem('users', user.email, user);

      ToastAndroid.show('Sucesso ao alterar a senha', ToastAndroid.SHORT);
      setTimeout(() => {
        navigation.navigate("index");
      }, 3500); 

    }

    console.log({ currentPassword, newPassword, confirmNewPassword });
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
            <Text style={styles.text}>Alterar Senha</Text>
          </View>
          <View style={styles.divider} />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.passwordContainer}>
            <TextInput
              label="Senha Atual"
              value={currentPassword}
              onChangeText={text => setCurrentPassword(text)}
              style={styles.input}
              mode="outlined"
              secureTextEntry={!showCurrentPassword}
            />
            <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)} style={styles.eyeIcon}>
              <Icon name={showCurrentPassword ? "eye-off" : "eye"} size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              label="Nova Senha"
              value={newPassword}
              onChangeText={text => setNewPassword(text)}
              style={styles.input}
              mode="outlined"
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
              <Icon name={showNewPassword ? "eye-off" : "eye"} size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              label="Confirmar Nova Senha"
              value={confirmNewPassword}
              onChangeText={text => setConfirmNewPassword(text)}
              style={[styles.input, !passwordsMatch && styles.errorInput]}
              mode="outlined"
              secureTextEntry={!showConfirmNewPassword}
              error={!passwordsMatch}
            />
            <TouchableOpacity onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)} style={styles.eyeIcon}>
              <Icon name={showConfirmNewPassword ? "eye-off" : "eye"} size={24} color="#333" />
            </TouchableOpacity>
          </View>
          {!passwordsMatch && (
            <Text style={styles.errorText}>As senhas não são compatíveis</Text>
          )}
          <Button mode="contained" onPress={handleChangePassword} style={styles.saveButton}>
            Alterar Senha
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
    flex: 1,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 0,
    marginRight: 16,
  },
});

export default ChangePasswordScreen;
