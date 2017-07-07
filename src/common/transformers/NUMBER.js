export const toNumber = (value) => {
    if (!value) {
        return 0;
    }

    if (Array.isArray(value)) {
        return value.map(toNumber);
    }

    if (typeof value === 'string') {
        const val = Number(value.trim());
        return Number.isNaN(val) ? 0 : val;
    }

    const val = Number(value);
    return Number.isNaN(val) ? 0 : val;
};

const transformation = () => value =>
    new Promise((resolve, reject) => {
        try {
            resolve(toNumber(value));
        } catch (error) {
            reject(error);
        }
    });

transformation.getMetas = () => ({
    name: 'NUMBER',
    type: 'transform',
    args: [],
});

export default transformation;
