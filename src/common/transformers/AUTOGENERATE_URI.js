import InistArk from 'inist-ark';
import config from '../../../config.json';

const ARBITRARY_SUBPUBLISHER = '39D';

export const autoGenerateUri = ({ naan, subpublisher, uriSize }) => () => () =>
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

            const identifier = ark.parse(ark.generate()).identifier;
            if (uriSize && Number.isInteger(uriSize)) {
                return resolve('uid:/'.concat(identifier.slice(0, uriSize)));
            }
            return resolve('uid:/'.concat(identifier));
        } catch (error) {
            return reject(error);
        }
    });

const transformation = autoGenerateUri(config);

transformation.getMetas = () => ({
    name: 'AUTOGENERATE_URI',
    type: 'value',
    args: [],
});

export default transformation;
