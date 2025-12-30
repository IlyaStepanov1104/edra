import {IBotStatisticsItem} from "@/entity/bot";
import {BackendBot} from "@shared/lib/api";

export interface IDashboardBot {
    bot: BackendBot;
    statistics: IBotStatisticsItem;
}

export interface IDashboardModule {
    module: string;
    bots: IDashboardBot[];
}
