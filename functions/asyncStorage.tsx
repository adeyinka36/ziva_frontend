import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeItemInAsyncStorage = async (item: any, name: string) => {
    try {
      await AsyncStorage.setItem(name, JSON.stringify(item));
    } catch (error) {
      console.error('Error storing current item:', error);
      throw error;
    }
  };
  
  // Retrieve the current game from local storage (AsyncStorage)
  export const getItemFromAsyyncStorage = async (name: string) => {
    try {
      const item = await AsyncStorage.getItem(name);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting current game:', error);
      throw error;
    }
  };