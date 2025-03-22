// In your topics API file (e.g., /api/topics.ts)
import axios, { AxiosError } from 'axios';
import { BASE_URL } from '@/utils/getUrls';

export interface Topic {
  id: string;
  description: string;
  image: string;
  is_custom: boolean;
  title: string;
}

interface PaginationLinks {
  self: string;
  next: string | null;
  prev: string | null;
}

export interface TopicsResponse {
  _links: PaginationLinks;
  data: Topic[];
}

// For standard topics (no pagination, query ignored)
export async function fetchTopics(query?: string): Promise<TopicsResponse | null> {
  try {
    const response = await axios.get<TopicsResponse>(`${BASE_URL}/topics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    return null;
  }
}

// For custom topics (with pagination and query parameter)
export async function fetchCustomTopics(query?: string, page: number = 1): Promise<TopicsResponse | null> {
  try {
    const response = await axios.get<TopicsResponse>(`${BASE_URL}/topics/custom`, {
      params: { q: query, page },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message, error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
}
