import React from 'react';
import { useForm } from 'react-hook-form';
import { View, Text, TextInput, Button, Alert, Picker } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import storageService from './storageService';

const FormComponent = () => {
  const { register, setValue, handleSubmit, watch } = useForm();
  const [image, setImage] = React.useState(null);

  React.useEffect(() => {
    register('name');
    register('houseType');
    register('houseValue');
    register('image');
    register('locationUrl');
    register('city');
    register('bairro');
    register('description');
  }, [register]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.uri);
      setValue('image', result.base64);
    }
  };

  const onSubmit = async (data) => {
    try {
      const existingData = await storageService.get('formData') || [];
      const updatedData = [...existingData, data];
      await storageService.save('formData', updatedData);
      Alert.alert('Dados salvos com sucesso');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro ao salvar dados');
    }
  };

  return (
    <View>
      <Text>Nome:</Text>
      <TextInput onChangeText={(text) => setValue('name', text)} />

      <Text>Tipo de Imóvel:</Text>
      <Picker
        selectedValue={watch('houseType')}
        onValueChange={(itemValue) => setValue('houseType', itemValue)}
      >
        <Picker.Item label="Casa" value="casa" />
        <Picker.Item label="Kitnet" value="kitnet" />
        <Picker.Item label="Apartamento" value="apartamento" />
        <Picker.Item label="Imóvel Compartilhado" value="imovel_compartilhado" />
      </Picker>

      <Text>Valor do Imóvel:</Text>
      <TextInput onChangeText={(text) => setValue('houseValue', text)} keyboardType="numeric" />

      <Text>Upload de Imagem:</Text>
      <Button title="Escolher Imagem" onPress={pickImage} />
      {image && <Text>Imagem selecionada</Text>}

      <Text>URL da Localização:</Text>
      <TextInput onChangeText={(text) => setValue('locationUrl', text)} />

      <Text>Cidade:</Text>
      <TextInput onChangeText={(text) => setValue('city', text)} />

      <Text>Bairro:</Text>
      <TextInput onChangeText={(text) => setValue('bairro', text)} />

      <Text>Descrição:</Text>
      <TextInput onChangeText={(text) => setValue('description', text)} />

      <Button title="Salvar" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default FormComponent;
