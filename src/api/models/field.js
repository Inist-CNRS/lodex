import expect from 'expect';
import omit from 'lodash.omit';
import { ObjectID } from 'mongodb';

import transformers from '../../common/transformers';
import isSchemeValid from '../services/isSchemeValid';

const validOperations = new RegExp(Object.keys(transformers).join('|'));

export default async (db) => {
    const collection = db.collection('field');
    await collection.createIndex({ name: 1 }, { unique: true });
    collection.findAll = () => collection.find({}).toArray();
    collection.findOneById = id => collection.findOne({ _id: new ObjectID(id) });
    collection.updateOneById = (id, field) => collection.findOneAndUpdate({
        _id: new ObjectID(id),
    }, omit(field, ['_id']), {
        returnOriginal: false,
    }).then(result => result.value);
    collection.removeById = id => collection.remove({ _id: new ObjectID(id) });

    return collection;
};

export const INVALID_FIELD_MESSAGE = 'Invalid data for field which need a name, a label, a cover, a valid scheme, a type and a transformers array'; // eslint-disable-line

export const validateFieldFactory = schemeServiceImpl => async (data) => {
    try {
        expect(data).toMatch({
            cover: /^(dataset|collection|document)$/,
            label: /^.{3,}$/,
            name: /^[\S]{3,}$/,
            scheme: /^https?:\/\/.+$/,
            transformers: [],
        });
    } catch (error) {
        throw new Error(INVALID_FIELD_MESSAGE);
    }

    if (!await schemeServiceImpl.isSchemeValid(data.scheme)) {
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

export const validateField = validateFieldFactory(isSchemeValid);
