// src/widgets/PageWrapper/PageWrapper.tsx
'use client';

import { FC, PropsWithChildren, useEffect } from 'react';
import styles from './PageWrapper.module.css';
import { Header } from "@shared/Header";
import { SideBar } from "@features/SideBar";
import { useParams } from "next/navigation";
import { PageModel } from "@shared/lib/pages";
import { useUnit } from "effector-react";

export const PageWrapper: FC<PropsWithChildren> = ({children}) => {
    const params = useParams();
    const pageParamsReceived = useUnit(PageModel.pageParamsReceived);

    useEffect(() => {
        if (params?.page || params?.bot) {
            pageParamsReceived({
                page: params.page as string,
                bot: params.bot as string
            });
        }
    }, [params]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.inner}>
                <Header/>
                <div className={styles.main}>
                    <SideBar/>
                    {children}
                </div>
            </div>
        </div>
    );
}
