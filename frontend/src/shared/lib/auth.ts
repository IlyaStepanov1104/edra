import {v4 as uuidv4} from 'uuid';

export const getUserToken = (): string | null => {
        if (typeof window !== 'undefined') {
            let token = localStorage.getItem('token');

            if (!token) {
                token = uuidv4();
                localStorage.setItem('token', token);
            }

            return token;
        }
        return null;
    };