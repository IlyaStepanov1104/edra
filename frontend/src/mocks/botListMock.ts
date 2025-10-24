import { IBot } from "@/entity/bot";
import { getBotStub } from "@/mocks/botMock";

export const getBotListStub = (length: number = 5, startId: number = 0, overrideAll?: Partial<IBot>): IBot[] => {
    const arr = [];
    for (let i = 0; i < length; i++) {
        arr.push(getBotStub({
            id: i + startId,
            order: i + startId,
            title: `Mock Bot ${i + startId}`,
            slug: `mock-bot-${i + startId}`, ...overrideAll
        }));
    }
    return arr;
}