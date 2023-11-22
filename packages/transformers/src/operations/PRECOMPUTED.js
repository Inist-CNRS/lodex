const isUndefinedOrEmpty = value =>
    typeof value === 'undefined' || value === '';

const transformation = (context, args) => () =>
    new Promise((resolve, reject) => {
        const precomputedArg = args.find(a => a.name === 'precomputed');

        if (!precomputedArg || isUndefinedOrEmpty(precomputedArg.value)) {
            return reject(
                new Error('Invalid Argument for PRECOMPUTED transformation'),
            );
        }

        const routineArg = args.find(a => a.name === 'routine');

        if (!routineArg || isUndefinedOrEmpty(routineArg.value)) {
            return reject(
                new Error('Invalid Argument for PRECOMPUTED transformation'),
            );
        }

        return resolve(context.precomputed.data);
    });

transformation.getMetas = () => ({
    name: 'PRECOMPUTED',
    type: 'value',
    args: [
        {
            name: 'precomputed',
            type: 'string',
        },
        {
            name: 'routine',
            type: 'string',
        },
    ],
});

export default transformation;
