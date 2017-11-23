export const join = (value, separator) => {
    if (!value) {
        return '';
    }

    if (!Array.isArray(value)) {
        throw new Error('Invalid value: need an array');
    }

    return value.join(separator);
};

const transformation = (_, args) => value => {
    const separator = args.find(a => a.name === 'separator');

    if (!separator) {
        throw new Error('Invalid Argument for JOIN transformation');
    }

    return new Promise((resolve, reject) => {
        try {
            resolve(join(value, separator.value));
        } catch (error) {
            reject(error);
        }
    });
};

transformation.getMetas = () => ({
    name: 'JOIN',
    type: 'transform',
    args: [{ name: 'separator', type: 'string' }],
});

export default transformation;
