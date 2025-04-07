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

export interface CustomTopicCreationResponse {
  _links: PaginationLinks;
  data: {
    id: string;
    description: string;
    image: string;
    is_custom: boolean;
    title: string;
  }
  message: string;
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
export async function fetchCustomTopics(query?: string): Promise<TopicsResponse | null> {
  try {
    const response = await axios.get<TopicsResponse>(
      `${BASE_URL}/topics/custom-topics`,
      {
        params: { q: query },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

//create custom topic or get the topic if it already exists
export async function getTopicOrCreateCustomTopicByTitle(title: string): Promise<CustomTopicCreationResponse | null> {
  try {
    console.log(`${BASE_URL}/topics/custom-topics`)
    const response = await axios.post<CustomTopicCreationResponse>(`${BASE_URL}/topics/custom-topics`, { title });
    return { ...response.data, message: response?.data.message };
  } catch (error: unknown) {
    console.log(error);
    return null;
  }
}
