export const toBoolean = value => {
    if (!value) {
        return false;
    }

    if (Array.isArray(value)) {
        return value.map(toBoolean);
    }

    if (typeof value === 'string') {
        const val = value.trim().toLocaleLowerCase();
        if (
            val === '1' ||
            val === 'true' ||
            val === 'on' ||
            val === 'ok' ||
            val === 'oui' ||
            val === 'yes'
        ) {
            return true;
        }
        return false;
    }

    if (value === 1 || value === true) {
        return true;
    }

    return false;
};

const transformation = () => value =>
    new Promise((resolve, reject) => {
        try {
            resolve(toBoolean(value));
        } catch (error) {
            reject(error);
        }
    });

transformation.getMetas = () => ({
    name: 'BOOLEAN',
    type: 'transform',
    args: [],
});

export default transformation;
