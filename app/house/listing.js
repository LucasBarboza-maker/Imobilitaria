import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import storageService from './storageService';

const ListHouses = () => {
  const [houses, setHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    houseType: '',
    houseValue: '',
    locationUrl: '',
    city: '',
    bairro: '',
    description: '',
  });

  useEffect(() => {
    const fetchHouses = async () => {
      const storedHouses = await storageService.get('formData');
      if (storedHouses) {
        setHouses(storedHouses);
        setFilteredHouses(storedHouses);
      }
    };

    fetchHouses();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    const filtered = houses.filter((house) =>
      Object.keys(filters).every((key) =>
        filters[key] === '' ? true : house[key]?.toString().includes(filters[key])
      )
    );
    setFilteredHouses(filtered);
  };

  return (
    <View>
      <Text>Filtrar Imóveis:</Text>
      {Object.keys(filters).map((key) => (
        <View key={key}>
          <Text>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
          <TextInput
            onChangeText={(text) => handleFilterChange(key, text)}
            value={filters[key]}
          />
        </View>
      ))}
      <Button title="Aplicar Filtros" onPress={applyFilters} />

      <Text>Lista de Imóveis:</Text>
      <FlatList
        data={filteredHouses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>Nome: {item.name}</Text>
            <Text>Tipo de Imóvel: {item.houseType}</Text>
            <Text>Valor do Imóvel: {item.houseValue}</Text>
            <Text>URL da Localização: {item.locationUrl}</Text>
            <Text>Cidade: {item.city}</Text>
            <Text>Bairro: {item.bairro}</Text>
            <Text>Descrição: {item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ListHouses;
