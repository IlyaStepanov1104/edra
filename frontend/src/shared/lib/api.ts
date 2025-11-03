import axios from 'axios';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api`,
  withCredentials: true
});

export const login = async (data: LoginData) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

interface ChatMessage {
  isFromUser: boolean;
  content: string;
  createdAt: string;
}

export const getChatHistory = async (botSlug: string, token: string): Promise<ChatMessage[]> => {
  const response = await api.get(`/chat/${botSlug}/history`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export interface BackendBot {
  _id: string;
  name: string;
  description: string;
  prompt: string;
  module: string;
  createdAt?: Date;
}

export const getBotList = async (module: string, token: string): Promise<BackendBot[]> => {
  const response = await api.get(`/bots`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { module }
  });
  return response.data;
};

export const sendMessage = async (botSlug: string, message: string, token: string): Promise<string> => {
  const response = await api.post(`/chat/${botSlug}/send`, { message }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

interface StatisticsData {
  metrics: {
    accuracy?: number;
    avgResponseTime?: number;
    sessionsCount?: number;
  };
  updatedAt?: string;
}

export const getStatistics = async (botSlug: string, token: string): Promise<StatisticsData> => {
  const response = await api.get(`/statistics/${botSlug}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export default api;