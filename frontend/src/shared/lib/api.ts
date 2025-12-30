import axios from 'axios';
import {getUserToken} from "@shared/lib/auth";

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api`,
});

api.interceptors.request.use((config) => {
    config.headers['X-Client-Token'] = getUserToken();
    return config;
});

interface ChatMessage {
    userId: string;
    botId: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
}

export const getChatHistory = async (botSlug: string): Promise<ChatMessage[]> => {
    const response = await api.get(`/chat/${botSlug}/history`);
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

export const getBotList = async (module: string): Promise<BackendBot[]> => {
    const response = await api.get(`/bots`, {
        params: {module}
    });
    return response.data;
};

export const sendMessage = async (botSlug: string, message: string): Promise<string> => {
    const response = await api.post(`/chat/${botSlug}/send`, {message});
    return response.data;
};

export interface StatisticsData {
    understandingPercent: number;
    comment: string;
    updatedAt?: string;
}

const DEFAULT_STATISTICS: StatisticsData = {
    understandingPercent: 0,
    comment: 'No data available yet. Start interacting with this bot to see your progress and personalized feedback.',
};

export const getStatistics = async (botSlug: string): Promise<StatisticsData> => {
    const response = await api.get(`/statistics/${botSlug}`);
    const data = response.data;
    if (data === "") return DEFAULT_STATISTICS;

    return data;
};

interface QRCodeLinkData {
    hash: string;
}

export const getQRCodeLink = async (): Promise<QRCodeLinkData> => {
    const response = await api.get(`/qr/generate`);
    return response.data;
};

export const postImage = async (data: FormData) => {
    const response = await api.post('/qr/generate', data);
    return response.data;
};

export interface LatexResult {
    status: 'pending' | 'processing' | 'done' | 'error';
    result?: string;
    error?: string;
}

export const getLatexResult = async (hash: string): Promise<LatexResult> => {
    const response = await api.get(`/qr/status/${hash}`);
    return response.data;
};

export const unsubscribeLatexResult = async (hash: string) => {
    const response = await api.get(`/qr/status/${hash}/unsubscribe`);
    return response.data;
};

export default api;