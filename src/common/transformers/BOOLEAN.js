import { transformer } from './transformer';

export const valueToBoolean = value => {
    if (!value) {
        return false;
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

const transformation = () => value => transformer(valueToBoolean, value);

transformation.getMetas = () => ({
    name: 'BOOLEAN',
    type: 'transform',
    args: [],
});

export default transformation;
