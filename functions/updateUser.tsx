import axios from 'axios';
import { BASE_URL } from '@/utils/getUrls';

interface updateUserDetailsType {
    userId: string,
    currentPassword: string,
    newPassword?: string|null,
    confirmNewPassword?: string|null,
    firstName?: string|null,
    lastName?: string|null,
    email?:  string|null,
    username?: string|null
}

export const updateUserDetails = async (request: updateUserDetailsType)=>{

    try{
        const data = {
            current_password: request.currentPassword || null,
            new_password: request.newPassword || null,
            new_password_confirmation: request.confirmNewPassword || null,
            first_name: request.firstName || null,
            last_name: request.lastName || null,
            email: request.email || null,
            username: request.username || null
          };
          
        const response = await axios.put(`${BASE_URL}/players/${request.userId}`, data)
        return response.data
    }catch(error){
        return null;
    }
}