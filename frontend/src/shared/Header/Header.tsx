'use client';

import { FC, useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Pages, PagesType } from "@shared/lib/pages";
import styles from './Header.module.css';
import { Logo } from "./Header.assets/Logo";
import { Button, DropdownMenu } from "reshaped";
import { IconUser } from "./Header.assets/IconUser";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@shared/lib/auth";

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
    const pathname = usePathname();
    const isAuthPage = ['/login', '/register'].includes(pathname || '');
    const { removeToken } = useAuth();

    const getHandleClick = (page: string) => () => router.push(`/${page}`)

    return (
        <div className={styles.Header}>
            <Logo className={styles.HeaderLogo}/>
            {!isAuthPage && (
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
                <DropdownMenu>
                    <DropdownMenu.Trigger>
                        {(attributes) => (
                            <Button
                                icon={IconUser}
                                color='primary'
                                variant={currentPage === 'profile' ? 'solid' : 'ghost'}
                                size='xlarge'
                                rounded
                                {...attributes}
                            />
                        )}
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item
                            onClick={() => {
                                removeToken();
                                router.push('/login');
                            }}
                        >
                            Logout
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu>
              </nav>
            )}
        </div>
    );
}
