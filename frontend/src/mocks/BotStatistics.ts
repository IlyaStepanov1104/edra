import { IBotStatistics } from "@/entity/bot";
import { getBotStatisticsItemStub } from "@/mocks/BotStatisticsItem";

export const getBotStatisticsStub = (override: Partial<IBotStatistics> = {}): IBotStatistics => ({
    title: 'Reading & writing',
    percent: 50.0,
    list: [
        getBotStatisticsItemStub({
            title: 'Topic with title',
            percent: 78.6,
        }),
        getBotStatisticsItemStub({
            title: 'Topic with title',
            percent: 53,
        }),
        getBotStatisticsItemStub({
            title: 'Topic with title',
            percent: 14.3,
        }),
        getBotStatisticsItemStub({
            title: 'Topic with title',
            percent: 100,
        }),
        getBotStatisticsItemStub({
            title: 'Topic with title',
            percent: 46.6,
        }),
        getBotStatisticsItemStub({
            title: 'Topic with title',
            percent: 0,
        }),
    ],
    ...override
});