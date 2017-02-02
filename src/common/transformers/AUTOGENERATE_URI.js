import InistArk from 'inist-ark';

const ARBITRARY_SUBPUBLISHER = '39D';

const transformation = ({ naan, subpublisher }) => field => () =>
    new Promise((resolve, reject) => {
        try {
            if (naan && subpublisher) {
                const ark = new InistArk({
                    naan,
                    subpublisher,
                });

                return resolve({
                    [field]: ark.generate(),
                });
            }

            const ark = new InistArk({
                subpublisher: ARBITRARY_SUBPUBLISHER,
            });

            return resolve({
                [field]: ark.parse(ark.generate()).identifier,
            });
        } catch (error) {
            return reject(error);
        }
    });

transformation.getMetas = () => ({
    name: 'AUTOGENERATE_URI',
    args: [],
});

export default transformation;
