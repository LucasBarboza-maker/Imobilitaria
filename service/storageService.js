import AsyncStorage from '@react-native-async-storage/async-storage';

const storageService = {
  save: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving data to local storage:', error);
    }
  },

  get: async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return JSON.parse(value);
      }
      return null;
    } catch (error) {
      console.error('Error retrieving data from local storage:', error);
      return null;
    }
  },

  getAll: async (params = {}) => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      const parsedItems = items.map(([key, value]) => JSON.parse(value));
      const filteredItems = parsedItems.filter(item =>
        Object.keys(params).every(param =>
            item[param] && item[param].toString().includes(params[param]))
      );
      return filteredItems;
    } catch (error) {
      console.error('Error retrieving all data from local storage:', error);
      return [];
    }
  },


  remove: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data from local storage:', error);
    }
  },
};

export default storageService;
