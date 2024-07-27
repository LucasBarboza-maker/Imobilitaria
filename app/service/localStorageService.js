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
      return JSON.parse(items.find(item => item.id == id));
    } catch (error) {
      console.error('Erro ao recuperar item', error);
      throw error;
    }
  }

  async updateItem(collection, id, updatedItem) {
    console.log(id);
    try {
      let items = await this.getAllItems(collection);
      const index = items.findIndex(item => item.id == id);
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

  async updateUserItem(collection, email, updatedItem) {
    try {
      let items = await this.getAllItems(collection);
      const index = items.findIndex(item => item.email === email);
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

      console.log(id);
      await AsyncStorage.setItem(COLLECTION_PREFIX + collection, JSON.stringify(items));
    } catch (error) {
      console.error('Erro ao deletar item', error);
      throw error;
    }
  }

  async deleteAllItems(collection) {
    try {
      await AsyncStorage.setItem(COLLECTION_PREFIX + collection, JSON.stringify([]));
      console.log(`Todos os itens da coleção ${collection} foram deletados.`);
    } catch (error) {
      console.error('Erro ao deletar todos os itens', error);
      throw error;
    }
  }
  


  async logout(email) {
    try {
      let items = await this.getAllItems("logged");
      items = items.filter(item => item.email !== email);
      await AsyncStorage.setItem(COLLECTION_PREFIX + collection, JSON.stringify(items));
    } catch (error) {
      console.error('Erro ao deslogar', error);
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

  
  async filterItems(collection, filterCriteria) {
    try {
      const items = await this.getAllItems(collection);
      return items.filter(item => {
        return Object.keys(filterCriteria).every(key => {
          if (filterCriteria[key] === '') return true;
          if (key === 'price') return item[key] <= filterCriteria[key];
          return item[key] === filterCriteria[key];
        });
      });
    } catch (error) {
      console.error('Erro ao filtrar itens', error);
      throw error;
    }
  }

  async filterItemsByCriteria(collection, criteria) {
    try {
      const items = await this.getAllItems(collection);
      return items.filter(item => {
        return Object.keys(criteria).every(key => {
          if (criteria[key] === '') return true; // Skip empty criteria
          if (key === 'price') return item[key] <= criteria[key]; // Special handling for price
          return item[key] === criteria[key];
        });
      });
    } catch (error) {
      console.error('Erro ao filtrar itens', error);
      throw error;
    }
  }


}







const localStorageService = new LocalStorageService();
export default localStorageService;
