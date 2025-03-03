import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export async function storeToken(token: string)
{
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    await SecureStore.setItemAsync('JWT_TOKEN', token);
}

export async function getToken()
{
    return await SecureStore.getItemAsync('JWT_TOKEN');
}

export async function removeToken()
{
    await SecureStore.deleteItemAsync('JWT_TOKEN');
}
