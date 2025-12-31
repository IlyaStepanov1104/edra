'use client';

import React, {FC} from 'react';
import {useUnit} from "effector-react";
import {BotModel} from "@/entity/bot";
import {Card, MenuItem, View} from "reshaped";
import {useParams, useRouter} from "next/navigation";
import {PageModel} from "@shared/lib/pages";
import styles from './SideBar.module.css';
import {usePathname} from "next/dist/client/components/navigation";

export const SideBar: FC = () => {
    const [botList, currentBot, pageParams] = useUnit([
        BotModel.$botList,
        BotModel.$currentBot,
        PageModel.$pageParams
    ]);

    const router = useRouter();
    const pathname = usePathname();

    const params = useParams();
    const currentBotSlug = params?.bot as string;
    const getHandleClick = (slug: string) => () => router.push(`/${pageParams?.page}/${slug}`)

    return (
        <View direction='column' justify="space-between">
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
                {pageParams?.page === 'information' && (
                    <MenuItem
                        size='large'
                        roundedCorners
                        selected={pathname.endsWith("dashboard")}
                        onClick={() => router.push(`/information/dashboard`)}
                    >
                        Dashboard
                    </MenuItem>
                )}
            </View>
            {pageParams?.page === 'math' && (
                <Card padding={6} className={styles.MathInfo}>
                    <ol>
                        <li>Write down your solution on a piece of paper (make sure it is readable).</li>
                        <li>Take a photo of it with your phone.</li>
                        <li>Tap the blue QR code button in the bottom-right corner.</li>
                        <li>Scan the QR code and upload the photo.</li>
                    </ol>
                </Card>
            )}
        </View>
    );
};
