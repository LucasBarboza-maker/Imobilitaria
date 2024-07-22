import * as React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, SafeAreaView, Platform, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Button, DefaultTheme, Provider as PaperProvider, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Dropdown } from 'react-native-paper-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons for the delete icon
import storageService from '../../service/storageService'; // Ensure the correct path to storageService

// Create a custom theme
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2457C5',
    placeholder: 'gray',
  },
};

function CreateHouseScreen() {
  const navigation = useNavigation();
  const [propertyType, setPropertyType] = React.useState('');
  const [value, setValue] = React.useState('');
  const [images, setImages] = React.useState([]);
  const [city, setCity] = React.useState('');
  const [neighborhood, setNeighborhood] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [nearbyColleges, setNearbyColleges] = React.useState([]);
  const [newCollege, setNewCollege] = React.useState('');

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });

    if (!result.cancelled) {
      const newImages = [...images, result.uri];
      setImages(newImages);
      await storageService.save('uploadedImages', newImages);
    }
  };

  const addCollege = () => {
    if (newCollege) {
      setNearbyColleges([...nearbyColleges, newCollege]);
      setNewCollege('');
    }
  };

  const removeCollege = (index) => {
    const updatedColleges = nearbyColleges.filter((_, i) => i !== index);
    setNearbyColleges(updatedColleges);
  };

  const handleSubmit = async () => {
    const houseData = {
      propertyType,
      value,
      images,
      city,
      neighborhood,
      description,
      nearbyColleges,
    };

    try {
      const existingData = await storageService.get('houses') || [];
      const updatedData = [...existingData, houseData];
      await storageService.save('houses', updatedData);
      Alert.alert('Sucesso', 'Imóvel adicionado com sucesso');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao adicionar imóvel');
    }
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.safeArea}>
        <ExpoStatusBar style="auto" />
        <Text style={styles.title}>Adicionar Imóvel</Text>

        <Button mode="contained" onPress={handleImageUpload} style={styles.button}>
          Upload de Imagens
        </Button>
        <FlatList
          data={images}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.image} />
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
        />
        <Dropdown
          label="Tipo de Imóvel"
          value={propertyType}
          onSelect={(value) => setPropertyType(value)}
          options={[
            { label: 'Casa', value: 'Casa' },
            { label: 'Kitnet', value: 'Kitnet' },
            { label: 'Apartamento', value: 'Apartamento' },
            { label: 'Imóvel Compartilhado', value: 'Imóvel Compartilhado' },
          ]}
          style={styles.input}
        />
        <TextInput
          label="Valor do Imóvel"
          placeholder='Valor do Imóvel'
          value={value}
          onChangeText={(text) => setValue(text)}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Cidade"
          value={city}
          onChangeText={(text) => setCity(text)}
          style={styles.input}
        />
        <View style={styles.collegeContainer}>
          <TextInput
            label="Faculdades Próximas"
            value={newCollege}
            onChangeText={(text) => setNewCollege(text)}
            style={styles.collegeInput}
          />
          <Button mode="contained" onPress={addCollege} style={styles.addButton}>
            Adicionar
          </Button>
        </View>
        <FlatList
          data={nearbyColleges}
          renderItem={({ item, index }) => (
            <View style={styles.collegeItem}>
              <Text>{item}</Text>
              <TouchableOpacity onPress={() => removeCollege(index)}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <TextInput
          label="Bairro"
          value={neighborhood}
          onChangeText={(text) => setNeighborhood(text)}
          style={styles.input}
        />
        <TextInput
          label="Descrição"
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline
          numberOfLines={4}
          style={[styles.input, styles.descriptionInput]}
        />
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Adicionar Imóvel
        </Button>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    padding: 16
  },
  scrollView: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 10
  },
  input: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 8,
  },
  collegeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  collegeInput: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  addButton: {
    flexShrink: 0,
  },
  collegeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  descriptionInput: {
    height: 100,
  },
});

export default CreateHouseScreen;
