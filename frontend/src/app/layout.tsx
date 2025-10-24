import "./globals.css";
import { ClientLayout } from "@/app/ClientLayout";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <ClientLayout>
            {children}
        </ClientLayout>
        </body>
        </html>
    );
}
