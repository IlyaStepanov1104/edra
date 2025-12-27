'use client';
import {PropsWithChildren} from "react";
import {PageWrapper} from "@/widgets/PageWrapper";

export default function RootLayout({children}: PropsWithChildren) {
    return (
        <PageWrapper>
            {children}
        </PageWrapper>
    );
}