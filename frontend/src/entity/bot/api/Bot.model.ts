import { atom } from "@shared/lib";
import { createEffect, createStore, sample } from "effector";
import { IBot } from "@/entity/bot";
import { getBotListStub } from "@/mocks/botListMock";
import { PageModel, PagesType } from "@shared/lib/pages";

const informationPageBotList: IBot[] = [
    {
        id: 1,
        order: 1,
        slug: 'information',
        title: 'Information',
    },
    {
        id: 2,
        order: 2,
        slug: 'dashboard',
        title: 'Dashboard',
    },
];

export const BotModel = atom(() => {
    const $botList = createStore<IBot[]>([]);
    const $currentBot = createStore<IBot | null>(null);

    const loadBotListFx = createEffect((page: PagesType | null) => {
        switch (page) {
            case 'information':
                return informationPageBotList;
            case 'math':
                return getBotListStub(17);
            case 'reading-and-writing':
                return getBotListStub(7);
            case 'practice-exam':
                return [...getBotListStub(4), ...getBotListStub(4, 4, {disabled: true})];
            default:
                return [];
        }
    });

    sample({
        clock: PageModel.$pageParams,
        fn: (params) => params?.page ?? null,
        target: loadBotListFx
    });

    sample({
        clock: PageModel.$pageParams,
        source: $botList,
        fn: (bots, params) => bots.find(({slug}) => params?.bot === slug) ?? null,
        target: $currentBot
    });

    sample({
        clock: loadBotListFx.doneData,
        target: $botList
    });

    return {
        $botList,
        $currentBot,
    };
});
