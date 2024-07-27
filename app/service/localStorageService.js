import AsyncStorage from '@react-native-async-storage/async-storage';

const COLLECTION_PREFIX = 'COLLECTION_';

class LocalStorageService {
  async saveItem(collection, item) {
    try {
      let items = await this.getAllItems(collection);
      items.push(item);
      await AsyncStorage.setItem(COLLECTION_PREFIX + collection, JSON.stringify(items));
      return item;
    } catch (error) {
      console.error('Erro ao salvar item', error);
      throw error;
    }
  }

  async getAllItems(collection) {
    try {
      const items = await AsyncStorage.getItem(COLLECTION_PREFIX + collection);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Erro ao recuperar itens', error);
      throw error;
    }
  }

  async getItemById(collection, id) {
    try {
      const items = await this.getAllItems(collection);
      return items.find(item => item.id === id);
    } catch (error) {
      console.error('Erro ao recuperar item', error);
      throw error;
    }
  }

  async updateItem(collection, id, updatedItem) {
    try {
      let items = await this.getAllItems(collection);
      const index = items.findIndex(item => item.id === id);
      if (index !== -1) {
        items[index] = updatedItem;
        await AsyncStorage.setItem(COLLECTION_PREFIX + collection, JSON.stringify(items));
        return updatedItem;
      } else {
        throw new Error('Item não encontrado');
      }
    } catch (error) {
      console.error('Erro ao atualizar item', error);
      throw error;
    }
  }

  async deleteItem(collection, id) {
    try {
      let items = await this.getAllItems(collection);
      items = items.filter(item => item.id !== id);
      await AsyncStorage.setItem(COLLECTION_PREFIX + collection, JSON.stringify(items));
    } catch (error) {
      console.error('Erro ao deletar item', error);
      throw error;
    }
  }

  async filterItems(collection, filterFn) {
    try {
      let items = await this.getAllItems(collection);
      return items.filter(filterFn);
    } catch (error) {
      console.error('Erro ao filtrar itens', error);
      throw error;
    }
  }
}

const localStorageService = new LocalStorageService();
export default localStorageService;
