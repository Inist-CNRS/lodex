import expect from 'expect';

import transformers from '../../common/transformers';
import schemeService from '../services/scheme';

const validOperations = new RegExp(Object.keys(transformers).join('|'));

export default async (db) => {
    const collection = db.collection('field');
    await collection.createIndex({ name: 1 }, { unique: true });
    collection.findAll = () => collection.find({}).toArray();
    collection.updateOneByName = (name, field) => collection.updateOne({
        name,
    }, field);
    collection.removeByName = name => collection.remove({ name });

    return collection;
};

export const INVALID_FIELD_MESSAGE = 'Invalid data for field need a name, label, cover, scheme, type and transformers array'; // eslint-disable-line

export const validateFieldFactory = schemeServiceImpl => (data) => {
    try {
        expect(data).toMatch({
            cover: /^(dataset|collection|document)$/,
            label: /^.{3,}$/,
            name: /^[\S]{3,}$/,
            scheme: /^https?:\/\/.+$/,
            transformers: [],
            type: /^https?:\/\/.+$/,
        });
    } catch (error) {
        throw new Error(INVALID_FIELD_MESSAGE);
    }

    if (!schemeServiceImpl.isSchemeValid(data.scheme)) {
        throw new Error(INVALID_FIELD_MESSAGE);
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

export const validateField = validateFieldFactory(schemeService);
