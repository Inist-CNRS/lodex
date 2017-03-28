import omit from 'lodash.omit';
import pick from 'lodash.pick';
import { ObjectID } from 'mongodb';

import { validateField as validateFieldIsomorphic } from '../../common/validateFields';
import { URI_FIELD_NAME } from '../../common/uris';
import { COVER_DOCUMENT, COVER_COLLECTION } from '../../common/cover';
import generateUid from '../services/generateUid';

export const buildInvalidPropertiesMessage = name =>
    `Invalid data for field ${name} which need a name, a label, a cover, a valid scheme if specified and a transformers array`; // eslint-disable-line

export const buildInvalidTransformersMessage = name =>
    `Invalid transformers for field ${name}: transformers must have a valid operation and an args array`; // eslint-disable-line

export const validateField = (data, isContribution) => {
    const validation = validateFieldIsomorphic(data, isContribution);

    if (!validation.propertiesAreValid) {
        throw new Error(buildInvalidPropertiesMessage(data.label));
    }

    if (!validation.transformersAreValid) {
        throw new Error(buildInvalidTransformersMessage(data.label));
    }

    return data;
};

export default async (db) => {
    const collection = db.collection('field');

    await collection.createIndex({ name: 1 }, { unique: true });

    collection.findAll = () => collection.find({}).sort({ position: 1 }).toArray();

    collection.findSearchableNames = async () => {
        const searchableFields = await collection.find({ searchable: true }).toArray();

        return searchableFields.map(({ name }) => name);
    };

    collection.findFacetNames = async () => {
        const searchableFields = await collection.find({ isFacet: true }).toArray();

        return searchableFields.map(({ name }) => name);
    };

    collection.findOneById = id => collection.findOne({ _id: new ObjectID(id) });

    collection.create = async (fieldData, nameArg) => {
        const name = nameArg || await generateUid();
        let position = fieldData.position;

        if (!position) {
            position = await collection.count({});
        }

        await collection.updateMany({
            position: { $gte: fieldData.position },
        }, {
            $inc: { position: 1 },
        });

        const { insertedId } = await collection.insertOne({
            ...omit({ ...fieldData, position }, ['_id']),
            name,
        });
        return collection.findOne({ _id: insertedId });
    };

    collection.updateOneById = async (id, field) => {
        const objectId = new ObjectID(id);
        const previousFieldVersion = await collection.findOneById(id);

        if (previousFieldVersion.position > field.position) {
            await collection.updateMany({
                _id: { $ne: objectId },
                position: { $gte: field.position, $lt: previousFieldVersion.position },
            }, {
                $inc: { position: 1 },
            });
        }

        if (previousFieldVersion.position < field.position) {
            await collection.updateMany({
                _id: { $ne: objectId },
                position: { $gt: previousFieldVersion.position, $lte: field.position },
            }, {
                $inc: { position: -1 },
            });
        }

        return collection.findOneAndUpdate({
            _id: objectId,
        }, omit(field, ['_id']), {
            returnOriginal: false,
        }).then(result => result.value);
    };

    collection.removeById = id => collection.remove({ _id: new ObjectID(id), name: { $ne: 'uri' } });

    collection.addContributionField = async (field, contributor, isLogged, nameArg) => {
        const name = field.name || nameArg || await generateUid();
        await validateField({
            ...field,
            cover: COVER_DOCUMENT,
            name,
        }, true);

        if (!field.name) {
            const fieldData = {
                ...pick(field, ['name', 'label', 'scheme']),
                name,
                cover: COVER_DOCUMENT,
                contribution: true,
            };
            if (!isLogged) {
                fieldData.contributors = [contributor];
            }

            await collection.insertOne({
                ...fieldData,
                name,
            });

            return name;
        }

        if (isLogged) {
            await collection.update({
                name,
                contribution: true,
            }, {
                $set: {
                    ...pick(field, ['label', 'scheme']),
                    cover: COVER_DOCUMENT,
                    contribution: true,
                },
            });

            return name;
        }

        await collection.update({
            name,
            contribution: true,
        }, {
            $set: {
                ...pick(field, ['label', 'scheme']),
                cover: COVER_DOCUMENT,
                contribution: true,
            },
            $addToSet: {
                contributors: contributor,
            },
        });

        return name;
    };
    collection.initializeModel = async () => {
        const uriColumn = await collection.findOne({ name: URI_FIELD_NAME });

        if (!uriColumn) {
            await collection.insertOne({
                cover: COVER_COLLECTION,
                label: URI_FIELD_NAME,
                name: URI_FIELD_NAME,
                display_on_list: true,
                transformers: [],
                position: 0,
            });
        }
    };

    return collection;
};
