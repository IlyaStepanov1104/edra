export interface IMessage {
    id: number;
    isMe: boolean;
    text: string;
    createdAt?: string;
}

export type IChatHistory = IMessage[];

export interface IApiChatMessage {
    content: string;
    isFromUser: boolean;
    createdAt: string;
}