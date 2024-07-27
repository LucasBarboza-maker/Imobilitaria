import * as React from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView, Platform, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Button, DefaultTheme, Provider as PaperProvider, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

function ChangePasswordScreen() {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = React.useState('');
  const params = useLocalSearchParams();
  const { email } = params;
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
  const [passwordsMatch, setPasswordsMatch] = React.useState(true);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    setPasswordsMatch(newPassword === confirmNewPassword);
  }, [newPassword, confirmNewPassword]);

  const handleChangePassword = async () => {
    if (!passwordsMatch) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if(newPassword.length <= 8){
      Alert.alert('Erro', 'A senha deve conter pelo menos 8 caracteres');
      return;
    }
    
    const users = await localStorageService.getAllItems('users');
    const user = users.find(user => user.email === email);

    if(!user){
      Alert.alert('Erro', 'Email não existente');
      return;
    }

    user.password = newPassword;
    await localStorageService.updateUserItem("users", user.email, user);

    ToastAndroid.show('Sucesso ao alterar a senha', ToastAndroid.LONG);
    setTimeout(() => {
      navigation.navigate("index");
    }, 3500); // Wait for the toast to disappear before navigating
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
              label="Nova Senha"
              value={newPassword}
              onChangeText={text => setNewPassword(text)}
              style={styles.input}
              mode="outlined"
              secureTextEntry={!showNewPassword}
              right={<TextInput.Icon name={showNewPassword ? "eye-off" : "eye"} onPress={() => setShowNewPassword(!showNewPassword)} />}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#4A90E2" />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              label="Confirmar Nova Senha"
              value={confirmNewPassword}
              onChangeText={text => setConfirmNewPassword(text)}
              style={[styles.input, !passwordsMatch && styles.errorInput]}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              right={<TextInput.Icon name={showConfirmPassword ? "eye-off" : "eye"} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
              error={!passwordsMatch}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#4A90E2" />
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
    width: '100%'
  },
  errorInput: {
    borderColor: 'red',
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

export default ChangePasswordScreen;
