import * as React from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView, Platform, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Button, DefaultTheme, Provider as PaperProvider, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';


const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2457C5',
  },
};

function DescriptionScreen() {
  const navigation = useNavigation();
  const [description, setDescription] = React.useState('');

  const handleSend = () => {
    console.log("Description sent:", description);
    setDescription('');
    Toast.show({
      type: 'success',
      text1: 'Mensagem foi enviada',
    });
  };

  return (
    <PaperProvider theme={theme}>
      <ImageBackground source={require('../../assets/images/inner-cozy.png')} style={styles.backgroundImage}>
        <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.8)']} style={styles.gradient}>
          <SafeAreaView style={styles.safeArea}>
            <ExpoStatusBar style="auto" />
            <View style={styles.headerContainer}>
              <View style={styles.section}>
                {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Icon name="arrow-left" size={24} color="#333" />
                </TouchableOpacity> */}
                <Text style={styles.text}>Descreva</Text>
              </View>
              <View style={styles.divider} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                label="Descreva o Problema"
                value={description}
                onChangeText={text => setDescription(text)}
                style={styles.largeInput}
                mode="flat"
                multiline
                numberOfLines={6}
              />
              <Button mode="contained" onPress={handleSend} style={styles.sendButton}>
                Enviar
              </Button>
            </View>
            <Toast ref={(ref) => Toast.setRef(ref)} />
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
    flex: 1,
  },
  largeInput: {
    marginBottom: 16,
  },
  sendButton: {
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

export default DescriptionScreen;
