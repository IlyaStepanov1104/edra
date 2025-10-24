export interface IBot {
    id: number;
    order: number;
    slug: string;
    title: string;
    percent?: number;
    comment?: string;
    disabled?: boolean;
}

export interface IMessage {
    id: number;
    botId: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

export interface IBotStatisticsItem {
    title: string;
    percent: number;
    comment: string;
}

export interface IBotStatistics {
    title: string;
    percent: number;
    list: IBotStatisticsItem[];
}
