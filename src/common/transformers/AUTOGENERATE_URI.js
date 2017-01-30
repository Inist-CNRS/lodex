import InistArk from 'inist-ark';

export default ({ NAAN, subPublisherId }) => destinationField => () =>
    new Promise((resolve, reject) => {
        try {
            if (NAAN && subPublisherId) {
                const ark = new InistArk({
                    naan: NAAN,
                    subpublisher: subPublisherId,
                });

                return resolve({
                    [destinationField]: ark.generate(),
                });
            }

            const ark = new InistArk({
                subpublisher: '39D',
            });

            return resolve({
                [destinationField]: ark.parse(ark.generate()).identifier,
            });
        } catch (error) {
            return reject(error);
        }
    });
