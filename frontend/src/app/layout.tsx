import "./globals.css";
import {Inter} from "next/font/google";
import "reshaped/themes/slate/theme.css";
import {Reshaped} from "reshaped";

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
        <Reshaped theme='slate'>
            {children}
        </Reshaped>
        </body>
        </html>
    );
}
