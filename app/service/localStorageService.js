import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

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
          if (criteria[key] === '') return true;
          if (key === 'price') return item[key] <= criteria[key];
          return item[key] === criteria[key];
        });
      });
    } catch (error) {
      console.error('Erro ao filtrar itens', error);
      throw error;
    }
  }

  async initializeData() {
    const dataIsInitialized = await AsyncStorage.getItem('dataIsInitialized');

    if (dataIsInitialized) {
      return;
    }


    await this.deleteAllItems('houses');
    await this.deleteAllItems('users');

    const users = [
      { id: '1', name: 'Marcelo', surname: 'Silva', email: 'marcelo.silva@example.com', phone: '1234567890', password: 'senha1' },
      { id: '2', name: 'João', surname: 'Pereira', email: 'joao.pereira@example.com', phone: '0987654321', password: 'senha2' },
      { id: '3', name: 'Maria', surname: 'Souza', email: 'maria.souza@example.com', phone: '1122334455', password: 'senha3' },
      { id: '4', name: 'Ana', surname: 'Costa', email: 'ana.costa@example.com', phone: '5566778899', password: 'senha4' },
      { id: '5', name: 'Carlos', surname: 'Oliveira', email: 'carlos.oliveira@example.com', phone: '6677889900', password: 'senha5' }
    ];

    const houseImages = {
      house1: [
        require('../../assets/images/houses/1/1.png'),
        require('../../assets/images/houses/1/2.png'),
        require('../../assets/images/houses/1/3.png'),
        require('../../assets/images/houses/1/4.png')
      ],
      house2: [
        require('../../assets/images/houses/2/1.png'),
        require('../../assets/images/houses/2/2.png'),
        require('../../assets/images/houses/2/3.png'),
        require('../../assets/images/houses/2/4.png'),
        // require('../../assets/images/houses/2/5.png'),
        // require('../../assets/images/houses/2/6.png')
      ],
      house3: [
        require('../../assets/images/houses/3/1.png'),
        require('../../assets/images/houses/3/2.png'),
        require('../../assets/images/houses/3/3.png'),
        // require('../../assets/images/houses/3/4.png'),
        // require('../../assets/images/houses/3/5.png')
      ],
      house4: [
        require('../../assets/images/houses/4/1.png'),
        require('../../assets/images/houses/4/2.png'),
        // require('../../assets/images/houses/4/3.png'),
        // require('../../assets/images/houses/4/4.png')
      ],
      house5: [
        require('../../assets/images/houses/5/1.png'),
        require('../../assets/images/houses/5/2.png'),
        require('../../assets/images/houses/5/3.png'),
        // require('../../assets/images/houses/5/4.png'),
        // require('../../assets/images/houses/5/5.png'),
        // require('../../assets/images/houses/5/6.png'),
        // require('../../assets/images/houses/5/7.png')
      ],
    };

    const houses = [ 
      {
        id: 1,
        propertyType: 'Imóvel Compartilhado',
        price: 950,
        state: 'RJ',
        city: 'Petrópolis',
        neighborhood: 'Amazonas',
        nearbyCollege: 'UFF Petrópolis',
        description: 'Excelente apartamento, localizado na Rua Bahia, no bairro amazonas, próximo do palácio Quitandinha, a BR-040, a Polícia Federal, a 20 minutos do Centro de Petrópolis e a 12 minutos do SMH. Apartamento bem arejado e ensolarado, composto por sala, 02 quartos, wc social, cozinha e área de serviço. Não tem condomínio, não tem garagem. Imóvel Compartilhado',
        url: "https://www.google.com/maps?ll=-22.523644,-43.210329&z=16&t=m&hl=en-US&gl=US&mapclient=embed&q=22%C2%B031%2725.1%22S+43%C2%B012%2737.2%22W+-22.523644,+-43.210329@-22.523644,-43.210329",
        images: houseImages.house1,
        announcer: users[0]
      },
      {
        id: 2,
        propertyType: 'Apartamento',
        price: 1500,
        state: 'RJ',
        city: 'Petrópolis',
        neighborhood: 'Quitandinha',
        nearbyCollege: 'UFF Petrópolis',
        description: 'Apartamento em ótimo local residencial, com fácil acesso para o Rio de Janeiro, ensolarado, constando de sala em dois ambientes, 2 quartos sendo 1 suíte, cozinha com armários e pequena área de serviço. Condomínio com salão de festas e uma vaga de garagem.',
        url: 'https://www.google.com/maps?ll=-22.523644,-43.210329&z=16&t=m&hl=en-US&gl=US&mapclient=embed&q=22%C2%B031%2725.1%22S+43%C2%B012%2737.2%22W+-22.523644,+-43.210329@-22.523644,-43.210329',
        images: houseImages.house2,
        announcer: users[1]
      },
      {
        id: 3,
        propertyType: 'Apartamento',
        price: 2013,
        state: 'RJ',
        city: 'Niterói',
        neighborhood: 'Centro',
        nearbyCollege: 'UFF Petrópolis',
        description: 'Apartamento aconchegante para alugar com 2 quartos e 1 banheiro no total. O condomínio fica localizado em Rua Pastor Manoel Avelino de Souza no bairro Centro em Niterói. Está bem localizado, próximo a pontos de interesse de Centro, tais como UFF - Faculdade de Medicina, Unidade Municipal de Educação Infantil Alberto de Oliveira, Creche Comunitária Rosalda Paim, Escola de Enfermagem Aurora de Afonso Costa (UFF), Escola Municipal Alberto Francisco Torres e Niterói Shopping.',
        url: 'https://www.google.com/maps/@-22.8933896,-43.1126078,3a,75y,90t/data=!3m7!1e1!3m5!1swZ9ilFbsHWBBIdisxkKXUA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3DwZ9ilFbsHWBBIdisxkKXUA%26cb_client%3Dmaps_sv.share%26w%3D900%26h%3D600%26yaw%3D0%26pitch%3D0%26thumbfov%3D90!7i16384!8i8192?coh=205410&entry=ttu',
        images: houseImages.house3,
        announcer: users[2]
      },
      {
        id: 4,
        propertyType: 'Apartamento',
        price: 1930,
        state: 'RJ',
        city: 'Rio de Janeiro',
        neighborhood: 'Catete',
        nearbyCollege: 'UFRJ Rio de Janeiro',
        description: 'Imóvel aconchegante para alugar com 1 quarto e 1 banheiro no total. O condomínio fica localizado em Rua Bento Lisboa no bairro Catete em Rio de Janeiro. Está bem localizado, próximo a pontos de interesse de Catete, tais como Centro Universitário IBMR, Colégio Pinheiro Guimarães, UFRJ - Faculdade de Direito, Bonfim, Estação Catete e Colégio Amaro Cavalcanti. Apto tipo kitnet, prático de manter. Reformado, hidráulica e elétrica. Box blindex. Banheiro cabe máq. de lavar, cozinha cabe fogão, arejado, sol da manhã, portaria 24h. Bicicletário. 5 minutos a pé das estações do metrô Catete e Largo do Machado. No entorno farto comércio, restaurantes, farmácias, bares, mercados, bancos, lojas diversas, salões de beleza, hortifruti, Palácio do Catete, aterro do Flamengo. Permitido: Animal pequeno porte.',
        url: 'https://www.google.com/maps/@-22.9275098,-43.1793502,3a,75y,213.33h,90t/data=!3m10!1e1!3m8!1sqaCagzaHK5NyRXBU3wVqnA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3DqaCagzaHK5NyRXBU3wVqnA%26cb_client%3Dmaps_sv.share%26w%3D900%26h%3D600%26yaw%3D213.32826119254435%26pitch%3D0%26thumbfov%3D90!7i16384!8i8192!9m2!1b1!2i49?coh=205410&entry=ttu',
        images: houseImages.house4,
        announcer: users[3]
      },
      {
        id: 5,
        propertyType: 'Apartamento',
        price: 2000,
        state: 'RJ',
        city: 'Petrópolis',
        neighborhood: 'Quitandinha',
        nearbyCollege: 'UFF Petrópolis',
        description: 'Composto de quarto com cama e armário, banheiro social e cozinha montada. área externa com parque verde.',
        url: 'https://www.google.com/maps?ll=-22.526,-43.211&z=16&t=m&hl=en-US&gl=US&mapclient=embed&q=22%C2%B031%2733.6%22S+43%C2%B012%2739.6%22W+-22.526000,+-43.211000@-22.526,-43.211',
        images: houseImages.house5,
        announcer: users[4]
      }
    ];


    const convertToBase64 = async (uri) => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
          console.error(`File does not exist: ${uri}`);
          return null;
        }
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        return `data:image/png;base64,${base64}`;
      } catch (error) {
        console.error(`Error converting file to base64: ${uri}`, error);
        return null;
      }
    };


    for (let house of houses) {
      try {
        const base64Images = await Promise.all(house.images.map(async (img) => {
          const asset = Asset.fromModule(img);
          await asset.downloadAsync();
          return convertToBase64(asset.localUri || asset.uri);
        }));
        house.images = base64Images.filter(Boolean);
        await this.saveItem('houses', house);
        console.log(`House saved: ${house.id}`);
      } catch (error) {
        console.error(`Error converting or saving images for house ${house.id}`, error);
      }
    }

    for (let user of users) {
      try {
        await this.saveItem('users', user);
        console.log(`User saved: ${user.id}`);
      } catch (error) {
        console.error(`Error saving user ${user.id}`, error);
      }
    }

    await AsyncStorage.setItem('dataIsInitialized', 'true');
    console.log('Data initialization complete');
  }

}





const localStorageService = new LocalStorageService();
export default localStorageService;
