import { atom } from "@shared/lib";
import { createEvent, createStore, sample } from "effector";
import { PagesType } from "./types";

interface PageParams {
    page: PagesType;
    bot: string;
}

export const PageModel = atom(() => {
    const pageParamsReceived = createEvent<PageParams>();

    const $pageParams = createStore<PageParams | null>(null).on(
        pageParamsReceived,
        (_, params) => params
    );

    return {pageParamsReceived, $pageParams};
});
