import axios from 'axios';
import { BASE_URL } from '@/utils/getUrls';

export interface NotificationResponse {
    _links: {
      _self: string;
      next: string | null;
      previous: string | null;
    };
    count: number;
    data: Notification[];
    total: number;
  }
  
  export interface Notification {
    id: string;
    player_id: string;
    title: string;
    message: string;
    type: NotificationType;
    is_read: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }
  
  export type NotificationType = "SMS" | "EMAIL" | "PUSH";
  

  export const getNotifications = async (
    playerId: string,
    nextPage: string = ""
  ): Promise<NotificationResponse | null> => {
    try {
      const url = !nextPage ? `${BASE_URL}/notifications/${playerId}` : nextPage
      const response = await axios.get<NotificationResponse>(`${url}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return null; 
    }
  };