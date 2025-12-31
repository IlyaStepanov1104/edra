import {Injectable} from '@nestjs/common';
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';

export interface QrStatus {
    status: 'pending' | 'processing' | 'done' | 'error';
    result?: string;
    error?: string;
}

@Injectable()
export class QrService {
    private hashes: Map<string, QrStatus> = new Map();

    createHash() {
        const hash = uuidv4();
        this.hashes.set(hash, {status: 'pending'});
        return {hash};
    }

    async processImage(hash: string, file: Express.Multer.File) {
        if (!this.hashes.has(hash)) {
            this.hashes.set(hash, {status: 'error', error: 'Invalid hash'});
            return {status: 'error', error: 'Invalid hash'};
        }
        this.hashes.set(hash, {status: 'processing'});
        try {
            const result = await axios.post(
                'https://api.mathpix.com/v3/text',
                {
                    src: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
                    format: ['html']
                },
                {
                    headers: {
                        'app_id': process.env.MATHPIX_APP_ID?.trim(),
                        'app_key': process.env.MATHPIX_APP_KEY?.trim(),
                        'Content-Type': 'application/json',
                    },
                },
            );
            const html = result.data.text
                .replace(/\\\[(.*?)\\\]/gs, (_, match) => `$$${match}$$`)
                .replace(/\\\((.*?)\\\)/gs, (_, match) => `$${match}$`)
                .replace(/\$([^$]+)\$/g, (_, match) => {
                    const corrected = match.replace(/(\d),(\d)/g, "$1.$2");
                    return `$${corrected}$`;
                });
            this.hashes.set(hash, {status: 'done', result: html});
            return {status: 'done', result: html};
        } catch (error) {
            this.hashes.set(hash, {status: 'error', error: error.message});
            return {status: 'error', error: error.message};
        }
    }

    getStatus(hash: string): QrStatus {
        if (!this.hashes.has(hash)) {
            return {status: 'error', error: 'Invalid hash'};
        }
        return this.hashes.get(hash);
    }

    deleteHash(hash: string) {
        this.hashes.delete(hash);
    }
}

