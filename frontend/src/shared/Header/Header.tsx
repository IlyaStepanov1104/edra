'use client';

import {FC} from 'react';
import {usePathname} from 'next/navigation';
import {PagesType} from "@shared/lib/pages";
import styles from './Header.module.css';
import {Logo} from "./Header.assets/Logo";
import {Button} from "reshaped";
import {useParams, useRouter} from "next/navigation";

interface ButtonProps {
    page: PagesType;
    text: string;
}

const buttons: ButtonProps[] = [{
    page: 'information',
    text: 'Information',
}, {
    page: 'reading-and-writing',
    text: 'Reading and Writing',
}, {
    page: 'math',
    text: 'Math',
}, {
    page: 'practice-exam',
    text: 'Practice Exam',
}]

export const Header: FC = () => {
    const params = useParams();
    const currentPage = params?.page as PagesType;
    const router = useRouter();

    const getHandleClick = (page: string) => () => router.push(`/${page}`)

    return (
        <div className={styles.Header}>
            <Logo className={styles.HeaderLogo}/>
            <nav className={styles.HeaderNav}>
                {buttons.map((button) => (
                    <Button
                        key={button.page}
                        onClick={getHandleClick(button.page)}
                        color='primary'
                        variant={currentPage === button.page ? 'solid' : 'ghost'}
                        size='xlarge'
                    >
                        {button.text}
                    </Button>
                ))}
            </nav>
        </div>
    );
}
