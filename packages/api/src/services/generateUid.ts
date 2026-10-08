import { randomBytes } from 'crypto';
import InistArk from 'inist-ark';

const ARBITRARY_SUBPUBLISHER = '39D';

export const autoGenerateUri =
    ({ naan, subpublisher, uriSize }: any) =>
    () =>
    () =>
        new Promise((resolve, reject) => {
            try {
                if (naan && subpublisher) {
                    const ark = new InistArk({
                        naan,
                        subpublisher,
                    });

                    return resolve(ark.generate());
                }

                const ark = new InistArk({
                    subpublisher: ARBITRARY_SUBPUBLISHER,
                });

                const { identifier } = ark.parse(ark.generate());
                if (uriSize && Number.isInteger(uriSize)) {
                    return resolve(`uid:/${identifier.slice(0, uriSize)}`);
                }
                return resolve(`uid:/${identifier}`);
            } catch (error) {
                return reject(error);
            }
        });

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
