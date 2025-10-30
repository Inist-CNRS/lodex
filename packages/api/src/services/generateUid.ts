import { randomBytes } from 'crypto';

export default () =>
    new Promise((resolve: any, reject: any) =>
        randomBytes(3, (error: any, result: any) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(
                result
                    .toString('base64')
                    .replace(/[+/]/g, 'z')
                    .replace(/^([0-9])(.*)/, 'a$2'),
            );
        }),
    );
