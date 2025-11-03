export interface IMessage {
    content: string;
    createdAt?: string;
    "_id": string,
    "userId": string,
    "botId": string,
    "role": "user" | 'assistant',
}

export type IChatHistory = IMessage[];

export interface IApiChatMessage {
    content: string;
    isFromUser: boolean;
    createdAt: string;
}