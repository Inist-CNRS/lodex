const isUndefinedOrEmpty = value =>
    typeof value === 'undefined' || value === '';

const transformation = (_, args) => () =>
    new Promise((resolve, reject) => {
        const webserviceArg = args.find(a => a.name === 'webservice');

        if (!webserviceArg || isUndefinedOrEmpty(webserviceArg.value)) {
            return reject(
                new Error('Invalid Argument for WEBSERVICE transformation'),
            );
        }

        return resolve(webserviceArg.value);
    });

transformation.getMetas = () => ({
    name: 'WEBSERVICE',
    type: 'value',
    args: [
        {
            name: 'webservice',
            type: 'string',
        },
    ],
});

export default transformation;
