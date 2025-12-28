import {IChatHistory} from "./types";
import {getChatHistory, sendMessage} from "@shared/lib/api";

export const getBotChatHistory = async (botSlug: string | null): Promise<IChatHistory> => {
    if (!botSlug) return [];

    try {
        const history = await getChatHistory(botSlug);
        return history.map((message, index) => ({
            _id: `${index + 1}`,
            ...message
        }));
    } catch (error) {
        console.error('Failed to fetch chat history:', error);
        return [];
    }
};

export const sendBotMessage = async (
    botSlug: string,
    message: string
): Promise<string> => {
    try {
        return await sendMessage(botSlug, message);
    } catch (error) {
        console.error('Failed to send message:', error);
        throw error;
    }
};