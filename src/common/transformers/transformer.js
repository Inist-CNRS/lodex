export const transformer = (func, value) =>
    new Promise((resolve, reject) => {
        try {
            if (Array.isArray(value)) {
                resolve(value.map(func));
            } else {
                resolve(func(value));
            }
        } catch (error) {
            reject(error);
        }
    });

export const transformerWithArg = (func, name, value, args) => {
    const arg = args.find(a => a.name === name);

    if (!arg) {
        throw new Error('Invalid Argument for ${name}');
    }

    return new Promise((resolve, reject) => {
        try {
            if (Array.isArray(value)) {
                resolve(value.map(val => func(val, arg.value)));
            } else {
                resolve(func(value, arg.value));
            }
        } catch (error) {
            reject(error);
        }
    });
};

export const transformerWithTwoArgs = (func, name1, name2, value, args) => {
    const arg1 = args.find(a => a.name === name1);
    const arg2 = args.find(a => a.name === name2);

    if (!arg1 || !arg2) {
        throw new Error('Invalid Argument for ${name1} or ${name2}');
    }

    return new Promise((resolve, reject) => {
        try {
            if (Array.isArray(value)) {
                resolve(value.map(val => func(val, arg1.value, arg2.value)));
            } else {
                resolve(func(value, arg1.value, arg2.value));
            }
        } catch (error) {
            reject(error);
        }
    });
};

export const rawTransformerWithArg = (func, name, value, args) => {
    const arg = args.find(a => a.name === name);

    if (!arg) {
        throw new Error('Invalid Argument for ${name}');
    }

    return new Promise((resolve, reject) => {
        try {
            resolve(func(value, arg.value));
        } catch (error) {
            reject(error);
        }
    });
};

export const rawTransformerWithoutArg = (func, value) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(func(value));
        } catch (error) {
            reject(error);
        }
    });
};
