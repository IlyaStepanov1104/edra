import {IChatHistory} from "./types";
import {getChatHistory, sendMessage} from "@shared/lib/api";
import {PageModel} from "@shared/lib/pages";

export const getBotChatHistory = async (botSlug: string | null, token: string | null): Promise<IChatHistory> => {
    console.log("%c 1 --> Line: 6||api.ts\n 'getBotChatHistory: ","color:#f0f;", botSlug, token);
    if (!botSlug || !token) return [];

    try {
        const history = await getChatHistory(botSlug, token);
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
    message: string,
    token: string
): Promise<string> => {
    try {
        return await sendMessage(botSlug, message, token);
    } catch (error) {
        console.error('Failed to send message:', error);
        throw error;
    }
};