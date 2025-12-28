import {v4 as uuidv4} from 'uuid';

export const getUserToken = (): string | null => {
    let token = localStorage.getItem('token');
    console.log("%c 1 --> Line: 5||auth.ts\n token: ","color:#f0f;", token);

    if (!token) {
        token = uuidv4();
        console.log("%c 2 --> Line: 9||auth.ts\n NEW token: ","color:#0f0;", token);
        localStorage.setItem('token', token);
    }

    return token;
};