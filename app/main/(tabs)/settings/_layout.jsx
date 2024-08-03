import * as React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Button, DefaultTheme, Provider as PaperProvider, Icon } from 'react-native-paper';

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
  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.safeArea}>
        <ExpoStatusBar style="auto" />
        <View style={styles.headerContainer}>
          <View style={styles.section}>
            <Text style={styles.text}>Menu</Text>
          </View>
          <View style={styles.divider} />
        </View>
        <View style={styles.scrollView}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('profile')}>
              <Icon name="account" size={20} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Editar Dados Pessoais</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('change-password-settings')}>
              <Icon name="lock" size={20} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Alterar Senha</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('help')}>
              <Icon name="help-circle" size={20} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Ajuda</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('index')}>
              <Icon name="exit-to-app" size={20} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
          </View>
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
  scrollView: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  buttonContainer: {
    margin: 16,
    width:'90%'
  },
  button: {
    backgroundColor: '#2457C5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
    height:20,
    width:20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
});

export default Settings;
