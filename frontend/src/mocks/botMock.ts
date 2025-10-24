import { IBot } from "@/entity/bot";

export const getBotStub = (override: Partial<IBot>): IBot => ({
    id: 1,
    slug: 'bot',
    title: 'Bot 1',
    order: 1,
    comment: 'Lorem ipsum',
    percent: 63.51,
    ...override
});