import {atom} from "@shared/lib";
import {createEffect, createStore, sample} from "effector";
import {IBot} from "../types";
import {PageModel, PagesType} from "@shared/lib/pages";
import {BackendBot, getBotList} from "@shared/lib/api";

const informationPageBotList: BackendBot[] = [
    {
        _id: "information",
        name: "information",
        description: "",
        prompt: "",
        module: "information",
    },
    {
        _id: "dashboard",
        name: "Dashboard",
        description: "",
        prompt: "",
        module: "information",
    },
];

export const BotModel = atom(() => {
    const $botList = createStore<IBot[]>([]);
    const $currentBot = createStore<IBot | null>(null);

    const loadBotListFx = createEffect(async (page: PagesType | null) => {
        if (!page) return;

        if (page === 'information') {
            return informationPageBotList;
        }

        const token = localStorage.getItem('jwtToken') ?? '';
        return await getBotList(page, token);
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
        fn: (bot) => bot ? bot.map((item, index) => ({
            id: index,
            order: index,
            slug: item._id,
            title: item.name,
            disabled: item.createdAt && +item.createdAt > Date.now()
        })) : [],
        target: $botList
    });

    return {
        $botList,
        $currentBot,
    };
});
