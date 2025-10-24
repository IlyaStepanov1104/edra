import { IChatHistory } from "./types";
import { getChatHistory, sendMessage } from "@shared/lib/api";
import { PageModel } from "@shared/lib/pages";

export const getBotChatHistory = async (botSlug: string | null, token: string): Promise<IChatHistory> => {
  if (!botSlug) return [];
  
  try {
    const history = await getChatHistory(botSlug, token);
    return history.map((message, index) => ({
      id: index + 1,
      isMe: message.isFromUser,
      text: message.content,
      createdAt: message.createdAt
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