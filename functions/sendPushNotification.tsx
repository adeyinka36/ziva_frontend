import axios, { AxiosError } from 'axios';
import { BASE_URL } from '@/utils/getUrls';


export const sendGameAcceptedOrDeclinedNotification = async (userId: string, gameId: string, action: string) => {
    const payload = {
        action
    }
    try {
        await axios.post(
          `${BASE_URL}/games/game-invite-response/${gameId}/${userId}`, payload);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
}