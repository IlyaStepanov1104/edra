export const Pages: Record<string, string> = {
    information: '/information',
    'reading-and-writing': '/reading-and-writing',
    math: '/math',
    'practice-exam': '/practice-exam',
    profile: '/profile',
}

export type PagesType = keyof typeof Pages;