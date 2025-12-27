import { atom } from "@shared/lib/atom";
import { createEvent, createStore, sample } from "effector";
import { PagesType } from "./types";

interface PageParams {
    page: PagesType;
    bot: string;
}

export const PageModel = atom(() => {
    const pageParamsReceived = createEvent<PageParams>();

    const $pageParams = createStore<PageParams | null>(null);

    sample({
        source: pageParamsReceived,
        target: $pageParams
    })

    return {pageParamsReceived, $pageParams};
});
