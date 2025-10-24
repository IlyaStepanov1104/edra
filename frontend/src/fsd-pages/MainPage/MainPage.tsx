'use client';
import { FC } from 'react'
import { Chat } from "@features/Chat";
import { BotModel } from "@/entity/bot";
import { useUnit } from "effector-react";
import { Dashboard } from "@features/Dashboard";

export const MainPage: FC = ({}) => {
    const bot = useUnit(BotModel.$currentBot);

    return bot?.slug === 'dashboard' ? <Dashboard/> : <Chat/>;
}

export default MainPage;