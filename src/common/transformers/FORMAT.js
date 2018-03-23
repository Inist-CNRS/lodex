import { vsprintf } from 'sprintf-js';

export const format = (value, tpl) => {
    if (!value) {
        return tpl;
    }
    if (Array.isArray(value)) {
        return vsprintf(tpl, value);
    }
    return vsprintf(tpl, [value]);
};

const transformation = (_, args) => value => {
    const arg = args.find(a => a.name === 'with');

    if (!arg) {
        throw new Error('Invalid Argument for FORMAT transformation');
    }

    return new Promise((resolve, reject) => {
        try {
            resolve(format(value, arg.value));
        } catch (error) {
            reject(error);
        }
    });
};

transformation.getMetas = () => ({
    name: 'FORMAT',
    type: 'transform',
    args: [{ name: 'with', type: 'string' }],
});

export default transformation;
