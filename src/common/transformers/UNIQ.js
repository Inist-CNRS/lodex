export const uniqArray = value => {
    if (!value) {
        return null;
    }

    if (Array.isArray(value)) {
        return value.filter((v, i, a) => a.indexOf(v) === i);
    }

    if (typeof value === 'object') {
        return null;
    }

    return value;
};

const transformation = () => value =>
    new Promise((resolve, reject) => {
        try {
            resolve(uniqArray(value));
        } catch (error) {
            reject(error);
        }
    });

transformation.getMetas = () => ({
    name: 'UNIQ',
    type: 'transform',
    args: [],
});

export default transformation;
