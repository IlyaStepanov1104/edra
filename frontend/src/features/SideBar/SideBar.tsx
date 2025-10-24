'use client';

import React, { FC } from 'react';
import { useUnit } from "effector-react";
import { BotModel } from "@/entity/bot";
import { MenuItem, View } from "reshaped";
import { useParams, useRouter } from "next/navigation";
import { PageModel } from "@shared/lib/pages";
import styles from './SideBar.module.css';

export const SideBar: FC = () => {
    const [botList, currentBot, pageParams] = useUnit([
        BotModel.$botList,
        BotModel.$currentBot,
        PageModel.$pageParams
    ]);

    const router = useRouter();

    const params = useParams();
    const currentBotSlug = params?.bot as string;

    const getHandleClick = (slug: string) => () => router.push(`/${pageParams?.page}/${slug}`)

    return (
        <View direction='column' gap={1} className={styles.SideBar}>
            {botList.map((item) => (
                <MenuItem
                    key={item.id}
                    size='large'
                    roundedCorners
                    selected={item.id === currentBot?.id || item.slug === currentBotSlug}
                    onClick={getHandleClick(item.slug)}
                    disabled={item.disabled}
                >
                    {item.title}
                </MenuItem>
            ))}
        </View>
    );
};
