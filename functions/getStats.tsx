import axios from 'axios';
import { BASE_URL } from '@/utils/getUrls';


export interface StatsResponse {
    _links: {
      _self:{
        href: string
      }
    };
    data: Stats;

  }
  
  export interface Stats {
    games_played: number
    games_won: number,
    games_lost: number,
    win_rate: number,
    games_drawn: number
    zivas: number,
    zivas_redeemable_date: Date | null
  }

export const getStats = async (
    playerId: string
): Promise<StatsResponse | null> =>
{
    try {
        const response = await axios.get(`${BASE_URL}/stats/${playerId}`)
        return  response.data;
    }catch(error) {
        console.log(error)
        return null;
    }
    
}