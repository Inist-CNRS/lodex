export const shift = (value, arg) => {
    if (!value) {
        return value;
    }
    const gap = Number(arg);
    return Array.isArray(value) || typeof value === 'string'
        ? value.slice(gap)
        : gap - value;
};

const transformation = (_, args) => value => {
    const arg = args.find(a => a.name === 'gap');

    if (!arg) {
        throw new Error('Invalid Argument for SHIFT transformation');
    }

    return new Promise((resolve, reject) => {
        try {
            resolve(shift(value, arg.value));
        } catch (error) {
            reject(error);
        }
    });
};

transformation.getMetas = () => ({
    name: 'SHIFT',
    type: 'transform',
    args: [{ name: 'gap', type: 'number' }],
});

export default transformation;
