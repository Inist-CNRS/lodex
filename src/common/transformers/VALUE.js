const transformation = (_, args) => () =>
    new Promise((resolve, reject) => {
        const valueArg = args.find(a => a.name === 'value');

        if (!valueArg || !valueArg.value) {
            reject(new Error('Invalid Argument for VALUE transformation'));
            return;
        }

        resolve(valueArg.value);
    });

transformation.getMetas = () => ({
    name: 'VALUE',
    type: 'value',
    args: [
        {
            name: 'value',
            type: 'string',
        },
    ],
});

export default transformation;
