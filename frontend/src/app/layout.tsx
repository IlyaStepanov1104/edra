import "./globals.css";
import "reshaped/themes/slate/theme.css";
import {Reshaped} from "reshaped";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: {
        default: "edra — Your AI Tutor for SAT Success",
        template: "%s — edra",
    },
    description:
        "edra is your always-on SAT tutor, delivering smart explanations, targeted practice, and instant feedback. Whether it’s math, reading, or writing, edra helps you learn faster, understand deeper, and score higher.",
    openGraph: {
        title: "edra — Your AI Tutor for SAT Success",
        description:
            "Smart explanations, targeted practice, and instant feedback for SAT math, reading, and writing.",
        url: "https://edra-en.vercel.app", // замени на реальный домен
        siteName: "edra",
        images: [
            {
                url: "https://edra-en.vercel.app/logo.png", // сделай OG-картинку
                width: 538,
                height: 200,
                alt: "edra — AI SAT Tutor",
            },
        ],
        locale: "en_US",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "edra — Your AI Tutor for SAT Success",
        description:
            "Your always-on AI tutor for SAT math, reading, and writing.",
        images: ["https://edra-en.vercel.app/logo.png"],
    },

    robots: {
        index: true,
        follow: true,
    },

    metadataBase: new URL("https://edra-en.vercel.app"),
};

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
