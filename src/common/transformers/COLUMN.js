const transformation = (_, args) => {
    const sourceField = args.find(a => a.name === 'column');

    if (!sourceField) {
        throw new Error('Innvalid Argument for COLUMN transformation');
    }

    return doc => new Promise((resolve, reject) => {
        try {
            if (!doc) {
                resolve(null);
                return;
            }
            resolve(doc[sourceField.value]);
        } catch (error) {
            reject(error);
        }
    });
};


transformation.getMetas = () => ({
    name: 'COLUMN',
    args: [{
        name: 'column',
        type: 'column',
    }],
});

export default transformation;
