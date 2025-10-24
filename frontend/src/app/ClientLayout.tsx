'use client';
import { Reshaped } from "reshaped";
import { FC, PropsWithChildren } from "react";
import "reshaped/themes/slate/theme.css";
import { PageWrapper } from "src/widgets/PageWrapper";

export const ClientLayout: FC<PropsWithChildren> = ({children}) => {
    return (
        <Reshaped theme='slate'>
            <PageWrapper>
                {children}
            </PageWrapper>
        </Reshaped>
    );
}