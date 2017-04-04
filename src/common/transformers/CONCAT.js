const transformation = (_, args) => {
    const sourceFields = args
        .find(a => a.name === 'columns');

    if (!sourceFields) {
        throw new Error('Invalid Argument for CONCAT transformation');
    }

    return doc => new Promise((resolve, reject) => {
        try {
            if (!doc) {
                resolve(null);
                return;
            }
            resolve(sourceFields.value.map(name => doc[name]));
        } catch (error) {
            reject(error);
        }
    });
};

transformation.getMetas = () => ({
    name: 'CONCAT',
    type: 'value',
    args: [{
        name: 'columns',
        type: 'columns',
    }],
});

export default transformation;
