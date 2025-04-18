import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Stores an item in AsyncStorage.
 * @param item - The data to store.
 * @param name - The key under which to store the data.
 */
export const storeItemInAsyncStorage = async (item: any, name: string) => {
  try {
    await AsyncStorage.setItem(name, JSON.stringify(item));
  } catch (error) {
    console.error('Error storing item:', error);
    throw error;
  }
};

/**
 * Retrieves an item from AsyncStorage.
 * @param name - The key of the item to retrieve.
 * @returns The parsed item or null if not found.
 */
export const getItemFromAsyncStorage = async (name: string) => {
  try {
    const item = await AsyncStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error retrieving item:', error);
    throw error;
  }
};

/**
 * Removes an item from AsyncStorage.
 * @param name - The key of the item to remove.
 */
export const removeItemFromAsyncStorage = async (name: string) => {
  try {
    await AsyncStorage.removeItem(name);
  } catch (error) {
    console.error('Error removing item:', error);
    throw error;
  }
};
