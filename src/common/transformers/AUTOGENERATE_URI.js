import InistArk from 'inist-ark';

const ARBITRARY_SUBPUBLISHER = '39D';

export default ({ naan, subpublisher }) => destinationField => () =>
    new Promise((resolve, reject) => {
        try {
            if (naan && subpublisher) {
                const ark = new InistArk({
                    naan,
                    subpublisher,
                });

                return resolve({
                    [destinationField]: ark.generate(),
                });
            }

            const ark = new InistArk({
                subpublisher: ARBITRARY_SUBPUBLISHER,
            });

            return resolve({
                [destinationField]: ark.parse(ark.generate()).identifier,
            });
        } catch (error) {
            return reject(error);
        }
    });
