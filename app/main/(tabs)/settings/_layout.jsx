import * as React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, SafeAreaView, Platform } from 'react-native';
import { useNavigation } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Button, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

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
        <ScrollView style={styles.scrollView}>
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={() => navigation.navigate('dados-pessoais')}>
              Dados Pessoais
            </Button>
            <Button mode="contained" onPress={() => navigation.navigate('alterar-senha')}>
              Alterar Senha
            </Button>
            <Button mode="contained" onPress={() => navigation.navigate('ajuda')}>
              Ajuda
            </Button>
            <Button mode="contained" onPress={() => navigation.navigate('sair')}>
              Sair
            </Button>
          </View>
        </ScrollView>
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
  },
  emptyScrollView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
  cardsContainer: {
    padding: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    flex: 1,
    textAlign: 'left',
    fontSize: 27,
    fontWeight: 'bold',
    color: '#333333',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  buttonContainer: {
    margin: 16,
  },
});

export default Settings;
