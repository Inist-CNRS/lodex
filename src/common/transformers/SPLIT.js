export const split = (value, separator) => {
    if (!value) {
        return [];
    }

    if (typeof value !== 'string') {
        throw new Error('Invalid value: need a string');
    }

    return value.split(separator);
};

const transformation = (_, args) => (value) => {
    const separator = args.find(a => a.name === 'separator');

    if (!separator) {
        throw new Error('Invalid Argument for JOIN transformation');
    }

    return new Promise((resolve, reject) => {
        try {
            resolve(split(value, separator.value));
        } catch (error) {
            reject(error);
        }
    });
};

transformation.getMetas = () => ({
    name: 'SPLIT',
    type: 'transform',
    args: [
        { name: 'separator', type: 'string' },
    ],
});

export default transformation;
