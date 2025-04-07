import axios from "axios";
import { BASE_URL } from "@/utils/getUrls";

export interface PlayerType {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  zivas: number;
  avatar: string;
  is_member: boolean;
  is_friend?: boolean;
}

export interface PlayerResponse {
  _links: {
    _self: string;
    next: string | null;
    previous: string | null;
  };
  count: number;
  total: number;
  data: PlayerType[];
}

/**
 * Fetch a paginated list of players, optionally filtered by `q`.
 * If you already have the next/prev URL from `_links.next` or `_links.previous`,
 * pass that in as `pageUrl` to load that page directly.
 */
export const getPlayers = async (
  q: string = "",
  pageUrl: string = ""
): Promise<PlayerResponse | null> => {
  try {
    let url: string;

    // If we have a specific pageUrl (next or prev link), use it directly
    if (pageUrl) {
      url = pageUrl;
    } 
    // Else, base URL is /players. Append ?q= if a search query was provided
    else if (q) {
      url = `${BASE_URL}/players?q=${encodeURIComponent(q)}`;
    } else {
      url = `${BASE_URL}/players`;
    }

    // Make the request
    const response = await axios.get<PlayerResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching players:", error);
    return null;
  }
};
