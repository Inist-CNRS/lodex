// @ts-expect-error TS(2792): Cannot find module 'lodash/chunk'. Did you mean to... Remove this comment to see the full error message
import chunk from 'lodash/chunk';
// @ts-expect-error TS(2792): Cannot find module 'lodash/groupBy'. Did you mean ... Remove this comment to see the full error message
import groupBy from 'lodash/groupBy';
// @ts-expect-error TS(2792): Cannot find module 'lodash/omit'. Did you mean to ... Remove this comment to see the full error message
import omit from 'lodash/omit';
// @ts-expect-error TS(2792): Cannot find module 'lodash/uniqWith'. Did you mean... Remove this comment to see the full error message
import uniqWith from 'lodash/uniqWith';
// @ts-expect-error TS(2792): Cannot find module 'jsonstream'. Did you mean to s... Remove this comment to see the full error message
import JSONStream from 'jsonstream';
import { Transform } from 'stream';
import { ObjectId } from 'mongodb';
import { getCreatedCollection } from './utils';

// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { URI_FIELD_NAME, moveUriToFirstPosition } from '../../common/uris';
import countNotUnique from './countNotUnique';
import countNotUniqueSubresources from './countNotUniqueSubresources';

export default async (db: any) => {
    const collection = await getCreatedCollection(db, 'dataset');
    collection.insertBatch = (documents: any) => {
        return Promise.all(
            chunk(documents, 100).map((data: any) => {
                const orderedData = moveUriToFirstPosition(data);
                return collection.insertMany(orderedData, {
                    forceServerObjectId: true,
                    w: 1,
                });
            }),
        );
    };
    collection.getExcerpt = async (filter: any) => {
        const result = await collection
            .find(filter)
            .sort({ $natural: 1 })
            .limit(100)
            .toArray();
        // choisr parmi les 100 premiers documents, ceux ayants le plus de champs
        const result2 = result
            .map((item: any) => {
                const validKeys = Object.keys(item).filter((key: any) => {
                    if (
                        item[key] === undefined ||
                        item[key] === null ||
                        item[key] === ''
                    ) {
                        return false;
                    }
                    return true;
                });
                return { ...item, __nb: validKeys.length };
            })
            .sort((x: any, y: any) => y.__nb - x.__nb);
        return result2.splice(0, 8).map((item: any) => {
            delete item.__nb;
            return item;
        });
    };

    collection.findLimitFromSkip = (
        limit: any,
        skip: any,
        query = {},
        sortBy: any,
        sortDir: any,
    ) =>
        collection
            .find(query)
            .sort(
                sortBy && sortDir
                    ? { [sortBy]: sortDir === 'ASC' ? 1 : -1 }
                    : {},
            )
            .skip(skip)
            .limit(limit)
            .toArray();

    collection.countWithoutUri = () =>
        collection.count({ uri: { $exists: false } });

    collection.countNotUnique = countNotUnique(collection);

    collection.countNotUniqueSubresources =
        countNotUniqueSubresources(collection);

    collection.ensureIsUnique = async (fieldName: any) =>
        (await collection.countNotUnique(fieldName)) === 0;

    collection.bulkUpdate = async (
        items: any,
        getFilter: any,
        upsert = false,
    ) => {
        if (items.length) {
            return await collection.bulkWrite(
                items.map((item: any) => ({
                    updateOne: {
                        filter: getFilter(item),
                        update: { $set: item },
                        upsert,
                    },
                })),
            );
        }
    };

    collection.upsertBatch = (documents: any, getFilter: any) =>
        Promise.all(
            chunk(documents, 100).map((data: any) =>
                collection.bulkUpdate(data, getFilter, true),
            ),
        );

    collection.bulkUpsertByUri = (data: any) => {
        const { withUri, withoutUri } = groupBy(data, (item: any) =>
            typeof item.uri === 'undefined' || item.uri === ''
                ? 'withoutUri'
                : 'withUri',
        );

        return Promise.all(
            [
                withUri &&
                    collection.upsertBatch(withUri, (item: any) => ({
                        uri: item[URI_FIELD_NAME],
                    })),
                withoutUri &&
                    collection.insertBatch(
                        // Unset uri that is set empty in the stream loader
                        // @TODO: Find where the uri is set to "" and delete it
                        withoutUri.map((item: any) =>
                            omit(item, [URI_FIELD_NAME]),
                        ),
                    ),
            ].filter((x: any) => x),
        );
    };

    collection.dumpAsJsonStream = async () => {
        const omitMongoId = new Transform({ objectMode: true });
        // @ts-expect-error TS(6133): 'enc' is declared but its value is never read.
        omitMongoId._transform = function (data: any, enc: any, cb: any) {
            this.push(omit(data, ['_id']));
            cb();
        };

        return (await collection.find({}).stream())
            .pipe(omitMongoId)
            .pipe(JSONStream.stringify());
    };

    collection.dumpAsJsonLStream = async (fieldsToExports = []) => {
        const stringify = new Transform({ objectMode: true });
        // @ts-expect-error TS(6133): 'enc' is declared but its value is never read.
        stringify._transform = function (data: any, enc: any, cb: any) {
            this.push(JSON.stringify(data).concat('\n'));
            cb();
        };

        return (
            await collection
                .find(
                    {},
                    {
                        projection: fieldsToExports.reduce(
                            (acc, field) => ({
                                ...acc,
                                [field]: 1,
                            }),
                            { _id: 0 },
                        ),
                    },
                )
                .stream()
        ).pipe(stringify);
    };

    collection.removeAttribute = async (attribute: any) =>
        collection.updateMany(
            {},
            { $unset: { [attribute]: 1 } },
            { multi: true },
        );

    collection.findBy = async (fieldName: any, value: any) => {
        if (!(await collection.ensureIsUnique(fieldName))) {
            throw new Error(
                `${fieldName} value is not unique for every document`,
            );
        }

        const results = await collection
            .find({ [fieldName]: value })
            .limit(1)
            .toArray();

        return results[0];
    };

    collection.getColumns = async () => {
        const result = await collection.getExcerpt();
        const columns: any = [];
        result.forEach((item: any) => {
            Object.keys(item).forEach((key: any) => {
                columns.push({ key, type: typeof item[key] });
            });
        });
        return uniqWith(columns, (x: any, y: any) => x.key === y.key);
    };

    collection.indexColumns = async () => {
        const aggregation = await collection
            .aggregate([
                { $project: { keyValue: { $objectToArray: '$$ROOT' } } },
                { $unwind: '$keyValue' },
                {
                    $group: {
                        _id: null,
                        keys: { $addToSet: '$keyValue.k' },
                    },
                },
            ])
            .toArray();
        if (aggregation[0]) {
            for (const key of aggregation[0].keys) {
                try {
                    await collection.createIndex({ [key]: 1 });
                } catch {
                    console.error(`Failed to index ${key}`);
                }
            }
        } else {
            console.warn(
                'Unable to create datagrid indexes, columns are invalid.',
            );
        }
    };

    collection.deleteOneById = async (id: any) =>
        collection.deleteOne({ _id: new ObjectId(id) });

    collection.deleteManyById = async (ids: any) => {
        return collection.deleteMany({
            _id: {
                $in: ids
                    .filter((id: any) => ObjectId.isValid(id))
                    .map((id: any) => new ObjectId(id)),
            },
        });
    };

    return collection;
};
