import documentationByOperation from './documentationByOperation';

const isUndefinedOrEmpty = (value) =>
    typeof value === 'undefined' || value === '';

const transformation = (_, args) => () =>
    new Promise((resolve, reject) => {
        const valueArg = args.find((a) => a.name === 'value');

        if (!valueArg || isUndefinedOrEmpty(valueArg.value)) {
            return reject(
                new Error('Invalid Argument for ROUTINE transformation'),
            );
        }

        return resolve(valueArg.value);
    });

transformation.getMetas = () => ({
    name: 'ROUTINE',
    type: 'value',
    args: [
        {
            name: 'value',
            type: 'string',
        },
    ],
    docUrl: documentationByOperation['ROUTINE'],
});

export default transformation;
