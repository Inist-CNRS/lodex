import expect from 'expect';

import transformers from '../../common/transformers';

const validOperations = new RegExp(Object.keys(transformers).join('|'));

export default (db) => {
    const collection = db.collection('field');
    collection.findAll = () => collection.find({}).toArray();
    collection.upsertOneByName = (name, field) => collection.updateOne({
        name,
    }, field, { upsert: true });
    collection.removeByName = name => collection.remove({ name });

    return collection;
};

export const validateField = (data) => {
    try {
        expect(data).toMatch({
            name: /^[\S]{3,}$/,
            label: /^.{3,}$/,
            transformers: [],
        });
    } catch (error) {
        throw new Error('Invalid data for field need a name, label and transformers array');
    }

    data.transformers.forEach((transformer, index) => {
        try {
            expect(transformer).toMatch({
                operation: validOperations,
                args: [],
            });
        } catch (error) {
            throw new Error(
`Invalid transformer in field at index: ${index},
transformer must have a valid operation and an args array`,
            );
        }
    });

    return data;
};
