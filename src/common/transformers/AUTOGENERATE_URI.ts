// @ts-expect-error TS(2792): Cannot find module 'inist-ark'. Did you mean to se... Remove this comment to see the full error message
import InistArk from 'inist-ark';
import config from '../../../config.json';

const ARBITRARY_SUBPUBLISHER = '39D';

export const autoGenerateUri =
    ({
        naan,
        subpublisher,
        uriSize
    }: any) =>
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

const transformation = autoGenerateUri(config);

// @ts-expect-error TS(2339): Property 'getMetas' does not exist on type '() => ... Remove this comment to see the full error message
transformation.getMetas = () => ({
    name: 'AUTOGENERATE_URI',
    type: 'value',
    args: [],
});

export default transformation;
