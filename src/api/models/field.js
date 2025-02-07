import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { ObjectId } from 'mongodb';

import { SCOPE_COLLECTION, SCOPE_DOCUMENT } from '../../common/scope';
import { URI_FIELD_NAME } from '../../common/uris';
import { validateField as validateFieldIsomorphic } from '../../common/validateFields';
import { createDiacriticSafeContainRegex } from '../services/createDiacriticSafeContainRegex';
import generateUid from '../services/generateUid';
import { castIdsFactory, getCreatedCollection } from './utils';

export const buildInvalidPropertiesMessage = (name) =>
    `Invalid data for field ${name} which need a name, a label, a scope, a valid scheme if specified and a transformers array`;

export const buildInvalidTransformersMessage = (name) =>
    `Invalid transformers for field ${name}: transformers must have a valid operation and an args array`;

export const validateField = (data, isContribution) => {
    const validation = validateFieldIsomorphic(data, isContribution);

    if (!validation.propertiesAreValid) {
        console.error('propertiesAreValid', JSON.stringify(validation));
        throw new Error(buildInvalidPropertiesMessage(data.label));
    }

    if (!validation.transformersAreValid) {
        console.error('transformersAreValid', JSON.stringify(validation));
        throw new Error(buildInvalidTransformersMessage(data.label));
    }

    return data;
};

const createSubresourceUriField = (subresource) => ({
    scope: SCOPE_COLLECTION,
    label: URI_FIELD_NAME,
    name: `${subresource._id}_${URI_FIELD_NAME}`,
    subresourceId: subresource._id,
    transformers: [
        {
            operation: 'COLUMN',
            args: [
                {
                    name: 'column',
                    type: 'column',
                    value: subresource.path,
                },
            ],
        },
        {
            operation: 'PARSE',
        },
        {
            operation: 'GET',
            args: [
                {
                    name: 'path',
                    type: 'string',
                    value: subresource.identifier,
                },
            ],
        },
        { operation: 'STRING' },
        {
            operation: 'REPLACE_REGEX',
            args: [
                {
                    name: 'searchValue',
                    type: 'string',
                    value: '^(.*)$',
                },
                {
                    name: 'replaceValue',
                    type: 'string',
                    value: `${subresource._id}/$1`,
                },
            ],
        },
        { operation: 'MD5', args: [] },
        {
            operation: 'REPLACE_REGEX',
            args: [
                {
                    name: 'searchValue',
                    type: 'string',
                    value: '^(.*)$',
                },
                {
                    name: 'replaceValue',
                    type: 'string',
                    value: `uid:/$1`,
                },
            ],
        },
    ],
    position: 1,
});

export default async (db) => {
    const collection = await getCreatedCollection(db, 'field');

    await collection.createIndex({ name: 1 }, { unique: true });

    collection.findAll = async () =>
        collection.find({}).sort({ position: 1, scope: 1 }).toArray();

    collection.findSearchableNames = async () => {
        const searchableFields = await collection
            .find({ searchable: true })
            .toArray();

        return searchableFields.map(({ name }) => name);
    };

    collection.findFacetNames = async () => {
        const searchableFields = await collection
            .find({ isFacet: true })
            .toArray();

        return searchableFields.map(({ name }) => name);
    };

    collection.findOneById = (id) => {
        if (!ObjectId.isValid(id)) {
            return null;
        }
        return collection.findOne({ _id: new ObjectId(id) });
    };

    collection.findManyByIds = async (ids) => {
        const fields = await collection
            .find({ _id: { $in: ids.map((id) => id) } })
            .toArray();

        return fields.reduce(
            (acc, field) => ({
                ...acc,
                [field._id]: field,
            }),
            {},
        );
    };

    collection.findOneByName = (name) => collection.findOne({ name });

    collection.create = async (
        fieldData,
        nameArg,
        shiftFieldsPosition = true,
    ) => {
        const name = nameArg || (await generateUid());
        if (!Number.isInteger(fieldData.position)) {
            throw new Error("Argument missing 'position' in field.create");
        }

        if (shiftFieldsPosition) {
            await collection.updateMany(
                {
                    position: { $gte: fieldData.position },
                },
                {
                    $inc: { position: 1 },
                },
            );
        }

        const { insertedId } = await collection.insertOne({
            ...omit(fieldData, ['_id']),
            name,
        });

        return collection.findOne({ _id: insertedId });
    };

    collection.updateOneById = async (id, field) => {
        const objectId = new ObjectId(id);
        const previousFieldVersion = await collection.findOneById(id);

        if (previousFieldVersion) {
            if (previousFieldVersion.position > field.position) {
                await collection.updateMany(
                    {
                        _id: { $ne: objectId },
                        position: {
                            $gte: field.position,
                            $lt: previousFieldVersion.position,
                        },
                    },
                    {
                        $inc: { position: 1 },
                    },
                );
            }

            if (previousFieldVersion.position < field.position) {
                await collection.updateMany(
                    {
                        _id: { $ne: objectId },
                        position: {
                            $gt: previousFieldVersion.position,
                            $lte: field.position,
                        },
                    },
                    {
                        $inc: { position: -1 },
                    },
                );
            }
        } else {
            console.warn(`field #${id} is not found`);
        }

        return collection.findOneAndUpdate(
            {
                _id: objectId,
            },
            {
                $set: omit(field, ['_id']),
            },
            { returnDocument: 'after' },
        );
    };

    collection.removeById = (id) =>
        collection.deleteOne({ _id: new ObjectId(id), name: { $ne: 'uri' } });

    collection.removeBySubresource = (subresourceId) =>
        collection.deleteOne({
            $or: [
                { subresourceId: new ObjectId(subresourceId) },
                { subresourceId },
            ],
        });

    collection.addContributionField = async (
        field,
        contributor,
        isLogged,
        nameArg,
    ) => {
        const name = field.name || nameArg || (await generateUid());
        const position = (await collection.getHighestPosition()) + 1;
        await validateField(
            {
                ...field,
                scope: SCOPE_DOCUMENT,
                name,
                position,
            },
            true,
        );

        if (!field.name) {
            const fieldData = {
                ...pick(field, ['name', 'label', 'scheme']),
                name,
                scope: SCOPE_DOCUMENT,
                contribution: true,
                position,
                transformers: [
                    {
                        operation: 'COLUMN',
                        args: [
                            {
                                name: 'column',
                                type: 'column',
                                value: field.label,
                            },
                        ],
                    },
                ],
            };
            if (!isLogged) {
                fieldData.contributors = [contributor];
            }

            await collection.insertOne(fieldData);

            return name;
        }

        if (isLogged) {
            await collection.updateOne(
                {
                    name,
                    contribution: true,
                },
                {
                    $set: {
                        ...pick(field, ['label', 'scheme']),
                        scope: SCOPE_DOCUMENT,
                        contribution: true,
                    },
                },
            );

            return name;
        }

        await collection.updateOne(
            {
                name,
                contribution: true,
            },
            {
                $set: {
                    ...pick(field, ['label', 'scheme']),
                    scope: SCOPE_DOCUMENT,
                    contribution: true,
                },
                $addToSet: {
                    contributors: contributor,
                },
            },
        );

        return name;
    };

    collection.initializeModel = async () => {
        const uriColumn = await collection.findOne({ name: URI_FIELD_NAME });

        if (!uriColumn) {
            await collection.insertOne({
                scope: SCOPE_COLLECTION,
                label: URI_FIELD_NAME,
                name: URI_FIELD_NAME,
                transformers: [
                    {
                        operation: 'AUTOGENERATE_URI',
                        args: [],
                    },
                ],
                position: 0,
            });
        }
    };

    collection.initializeSubresourceModel = async (subresource) => {
        const newField = createSubresourceUriField(subresource);

        await collection.updateOne(
            {
                name: `${subresource._id}_${URI_FIELD_NAME}`,
            },
            {
                $set: newField,
            },
            {
                upsert: true,
            },
        );
    };

    collection.updateSubresourcePaths = async (subresource) => {
        const fields = await collection
            .find({ subresourceId: subresource._id })
            .toArray();

        const updatedFields = fields.map((field) => {
            const [columnTransformer, ...transformers] = field.transformers;

            return {
                ...field,
                transformers: [
                    {
                        ...columnTransformer,
                        args: [
                            {
                                ...columnTransformer.args[0],
                                value: subresource.path,
                            },
                        ],
                    },
                    ...transformers,
                ],
            };
        });

        await Promise.all(
            updatedFields.map((uf) =>
                collection.updateOne(
                    {
                        _id: new ObjectId(uf._id),
                    },
                    { $set: uf },
                ),
            ),
        );
    };

    collection.getHighestPosition = async () => {
        const DESC = -1;
        const [highestPositionField] = await collection
            .find({}, { position: 1 })
            .sort({ position: DESC })
            .limit(1)
            .toArray();

        return highestPositionField ? highestPositionField.position : 0;
    };

    collection.updatePosition = async (name, position) =>
        collection.findOneAndUpdate(
            { name },
            { $set: { position } },
            { returnDocument: 'after' },
        );

    collection.findByNames = async (names) => {
        const fields = await collection
            .find({ name: { $in: names } })
            .toArray();
        return fields.reduce(
            (acc, field) => ({
                ...acc,
                [field.name]: field,
            }),
            {},
        );
    };

    collection.findByName = async (name) => {
        const fields = await collection.findByNames([name]);

        return fields[name];
    };

    collection.castIds = castIdsFactory(collection);

    collection.findResourceTitle = async () => {
        return collection.findOne({ overview: 1 });
    };

    collection.findSubResourceTitles = async () => {
        return collection.find({ overview: 5 }).toArray();
    };

    collection.findIdsByLabel = async (label) => {
        const fields = await collection
            .find(
                {
                    label: createDiacriticSafeContainRegex(label),
                },
                { _id: true },
            )
            .toArray();

        return fields.map(({ _id }) => _id.toString());
    };

    collection.findIdsByInternalName = async (internalName) => {
        const fields = await collection
            .find(
                {
                    internalName: createDiacriticSafeContainRegex(internalName),
                },
                { _id: true },
            )
            .toArray();

        return fields.map(({ _id }) => _id.toString());
    };

    collection.findIdsByName = async (name) => {
        const fields = await collection
            .find(
                {
                    name: new RegExp(`^.*${name}.*$`, 'gi'),
                },
                { _id: true },
            )
            .toArray();

        return fields.map(({ _id }) => _id.toString());
    };

    collection.findIdsByInternalScopes = async (internalScopes) => {
        const fields = await collection
            .find(
                {
                    internalScopes,
                },
                { _id: true },
            )
            .toArray();

        return fields.map(({ _id }) => _id.toString());
    };

    return collection;
};
