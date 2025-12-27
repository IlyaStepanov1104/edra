import "./globals.css";
import "reshaped/themes/slate/theme.css";
import {Reshaped} from "reshaped";

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
