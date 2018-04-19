const transformation = (_, args) => () =>
    new Promise((resolve, reject) => {
        const valueArg = args.find(a => a.name === 'sparql');

        if (!valueArg || !valueArg.value) {
            reject(new Error('Invalid Argument for SPARQL transformation'));
            return;
        }

        resolve(valueArg.value);
    });

transformation.getMetas = () => ({
    name: 'SPARQL',
    type: 'value',
    args: [
        {
            name: 'sparql',
            type: 'string',
        },
    ],
});

export default transformation;
