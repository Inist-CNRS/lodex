export const truncate = (value, arg) => {
    if (!value) {
        return value;
    }
    const gap = Number(arg);
    return Array.isArray(value) || typeof value === 'string'
        ? value.slice(0, gap)
        : gap + value;
};

const transformation = (_, args) => value => {
    const arg = args.find(a => a.name === 'gap');

    if (!arg) {
        throw new Error('Invalid Argument for TRUNCATE transformation');
    }

    return new Promise((resolve, reject) => {
        try {
            resolve(truncate(value, arg.value));
        } catch (error) {
            reject(error);
        }
    });
};

transformation.getMetas = () => ({
    name: 'TRUNCATE',
    type: 'transform',
    args: [{ name: 'gap', type: 'number' }],
});

export default transformation;
