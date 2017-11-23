export const defval = (value, alternative) => {
    if (!value) {
        return alternative;
    }
    return value;
};

const transformation = (_, args) => value => {
    const alternative = args.find(a => a.name === 'alternative');

    if (!alternative) {
        throw new Error('Invalid Argument for DEFAULT transformation');
    }

    return new Promise((resolve, reject) => {
        try {
            resolve(defval(value, alternative.value));
        } catch (error) {
            reject(error);
        }
    });
};

transformation.getMetas = () => ({
    name: 'DEFAULT',
    type: 'transform',
    args: [{ name: 'alternative', type: 'string' }],
});

export default transformation;
