import { MetadataRoute } from 'next';
import api from '@/shared/lib/api';

export const revalidate = 3600;

const BASE_URL = 'https://edra-en.vercel.app';

const MODULES: string[] = [
    'information',
    'reading-and-writing',
    'math',
    'practice-exam',
];

type Bot = {
    slug: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const urls: MetadataRoute.Sitemap = [];

    // Статическая страница
    urls.push({
        url: `${BASE_URL}/information/dashboard`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    });

    for (const moduleName of MODULES) {
        const response = await api.get<Bot[]>('/bots', {
            params: { module: moduleName },
        });

        console.log("%c 1 --> Line: 31||sitemap.ts\n response: ","color:#f0f;", response.data);

        response.data.forEach((bot) => {
            urls.push({
                url: `${BASE_URL}/${moduleName}/${bot._id}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        });
    }

    return urls;
}
