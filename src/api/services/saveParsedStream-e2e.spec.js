import expect from 'expect';
import Stream from 'stream';
import omit from 'lodash.omit';
import get from 'lodash.get';
import set from 'lodash.set';

import saveParsedStream from './saveParsedStream';
import {
    connect,
    loadFixtures,
    clear,
    close,
} from '../../common/tests/fixtures';
import datasetFactory from '../models/dataset';
import publishedDataset from '../models/publishedDataset';
import publishedFacet from '../models/publishedFacet';
import field from '../models/field';
import saveStream from './saveStream';
import publishDocuments from './publishDocuments';
import publishFacets from '../controller/api/publishFacets';

const fixtures = {
    field: [
        {
            cover: 'collection',
            label: 'uri',
            name: 'uri',
            transformers: [
                {
                    operation: 'COLUMN',
                    args: [
                        {
                            name: 'column',
                            type: 'column',
                            value: 'name',
                        },
                    ],
                },
            ],
        },
        {
            cover: 'collection',
            label: 'Stronger than',
            name: 'STRONGER',
            isFacet: true,
            transformers: [
                {
                    operation: 'LINK',
                    args: [
                        {
                            name: 'reference',
                            type: 'column',
                            value: 'stronger_than',
                        },
                        {
                            name: 'identifier',
                            type: 'column',
                            value: 'id',
                        },
                    ],
                },
            ],
        },
        {
            cover: 'collection',
            label: 'name',
            name: 'NAME',
            transformers: [
                {
                    operation: 'COLUMN',
                    args: [
                        {
                            name: 'column',
                            type: 'column',
                            value: 'name',
                        },
                    ],
                },
            ],
        },
    ],
    dataset: [
        { id: 1, name: 'rock', stronger_than: 2 },
        { id: 2, name: 'scissor', stronger_than: 3 },
        { id: 3, name: 'paper', stronger_than: 1 },
    ],
    publishedDataset: [
        {
            uri: 'uid:/rock',
            versions: [{ NAME: 'rock', STRONGER: 'uid:/scissor' }],
        },
        {
            uri: 'uid:/scissor',
            versions: [{ NAME: 'scissor', STRONGER: 'uid:/paper' }],
        },
        {
            uri: 'uid:/paper',
            versions: [{ NAME: 'paper', STRONGER: 'uid:/rock' }],
        },
    ],
    publishedFacet: [
        { field: 'STRONGER', value: 'uid:/rock', count: 1 },
        { field: 'STRONGER', value: 'uid:/scissor', count: 1 },
        { field: 'STRONGER', value: 'uid:/paper', count: 1 },
    ],
};

describe('e2e upload saveparsedStream', () => {
    let db;
    before(async () => {
        db = await connect();
    });

    describe('optimal', () => {
        let ctx, parsedStream;
        const newDocuments = [
            { id: 4, name: 'spock', stronger_than: 1 },
            { id: 5, name: 'lizard', stronger_than: 3 },
        ];
        before(async () => {
            await loadFixtures(fixtures);

            parsedStream = new Stream.Transform({ objectMode: true });
            newDocuments.forEach(doc => parsedStream.push(doc));
            parsedStream.push(null);
            const dataset = await datasetFactory(db);

            ctx = {
                dataset,
                publishedDataset: await publishedDataset(db),
                field: await field(db),
                publishedFacet: await publishedFacet(db),
                saveStream: saveStream(dataset.insertMany.bind(dataset)),
                publishDocuments,
                publishFacets,
            };
        });

        it('should add new document to publication', async () => {
            await saveParsedStream(ctx)(parsedStream);
            expect(await ctx.dataset.count()).toEqual(5);
            expect(await ctx.dataset.find({}, { _id: 0 }).toArray()).toEqual([
                {
                    id: 1,
                    name: 'rock',
                    stronger_than: 2,
                    lodex_published: true,
                },
                {
                    id: 2,
                    name: 'scissor',
                    stronger_than: 3,
                    lodex_published: true,
                },
                {
                    id: 3,
                    name: 'paper',
                    stronger_than: 1,
                    lodex_published: true,
                },
                { id: 4, name: 'spock', stronger_than: 1 },
                { id: 5, name: 'lizard', stronger_than: 3 },
            ]);
            expect(await ctx.publishedDataset.count()).toEqual(5);

            const publishedDataset = await ctx.publishedDataset
                .find({}, { _id: 0 })
                .toArray();

            const cleanedPublishedDataset = publishedDataset.map(doc =>
                // omit versions[0].publicationDate
                set(
                    doc,
                    'versions[0]',
                    omit(get(doc, 'versions[0]'), ['publicationDate']),
                ),
            );
            expect(cleanedPublishedDataset).toEqual([
                {
                    uri: 'uid:/rock',
                    versions: [{ NAME: 'rock', STRONGER: 'uid:/scissor' }],
                    lodex_published: true,
                },
                {
                    uri: 'uid:/scissor',
                    versions: [{ NAME: 'scissor', STRONGER: 'uid:/paper' }],
                    lodex_published: true,
                },
                {
                    uri: 'uid:/paper',
                    versions: [{ NAME: 'paper', STRONGER: 'uid:/rock' }],
                    lodex_published: true,
                },
                {
                    uri: 'uid:/spock',
                    versions: [{ NAME: 'spock', STRONGER: '' }],
                },
                {
                    uri: 'uid:/lizard',
                    versions: [{ NAME: 'lizard', STRONGER: '' }],
                },
            ]);

            expect(
                await ctx.publishedFacet.find({}, { _id: 0 }).toArray(),
            ).toEqual([
                { field: 'STRONGER', value: '', count: 2 },
                { field: 'STRONGER', value: 'uid:/paper', count: 1 },
                { field: 'STRONGER', value: 'uid:/rock', count: 1 },
                { field: 'STRONGER', value: 'uid:/scissor', count: 1 },
            ]);
        });

        after(async () => {
            await clear();
        });
    });

    describe('uri duplicate error', () => {
        let ctx, parsedStream;
        const newDocuments = [
            { id: 4, name: 'spock', stronger_than: 1 },
            { id: 5, name: 'lizard', stronger_than: 3 },
            { id: 1, name: 'rock', stronger_than: 2 }, // duplicate
        ];
        before(async () => {
            await loadFixtures(fixtures);

            parsedStream = new Stream.Transform({ objectMode: true });
            newDocuments.forEach(doc => parsedStream.push(doc));
            parsedStream.push(null);
            const dataset = await datasetFactory(db);

            ctx = {
                dataset,
                publishedDataset: await publishedDataset(db),
                field: await field(db),
                publishedFacet: await publishedFacet(db),
                saveStream: saveStream(dataset.insertMany.bind(dataset)),
                publishDocuments,
                publishFacets,
            };
        });

        it('should not add new document to publication', async () => {
            const error = await saveParsedStream(ctx)(parsedStream).catch(
                error => error,
            );
            expect(error.message).toBe(
                'E11000 duplicate key error index: lodex_test.publishedDataset.$uri_1 dup key: { : "uid:/rock" }',
            );
            expect(await ctx.dataset.count()).toEqual(3);
            expect(await ctx.dataset.find({}, { _id: 0 }).toArray()).toEqual([
                {
                    id: 1,
                    name: 'rock',
                    stronger_than: 2,
                    lodex_published: true,
                },
                {
                    id: 2,
                    name: 'scissor',
                    stronger_than: 3,
                    lodex_published: true,
                },
                {
                    id: 3,
                    name: 'paper',
                    stronger_than: 1,
                    lodex_published: true,
                },
            ]);
            expect(await ctx.publishedDataset.count()).toEqual(3);

            const publishedDataset = await ctx.publishedDataset
                .find({}, { _id: 0 })
                .toArray();

            const cleanedPublishedDataset = publishedDataset.map(doc =>
                // omit versions[0].publicationDate
                set(
                    doc,
                    'versions[0]',
                    omit(get(doc, 'versions[0]'), ['publicationDate']),
                ),
            );
            expect(cleanedPublishedDataset).toEqual([
                {
                    uri: 'uid:/rock',
                    versions: [{ NAME: 'rock', STRONGER: 'uid:/scissor' }],
                    lodex_published: true,
                },
                {
                    uri: 'uid:/scissor',
                    versions: [{ NAME: 'scissor', STRONGER: 'uid:/paper' }],
                    lodex_published: true,
                },
                {
                    uri: 'uid:/paper',
                    versions: [{ NAME: 'paper', STRONGER: 'uid:/rock' }],
                    lodex_published: true,
                },
            ]);

            expect(
                await ctx.publishedFacet.find({}, { _id: 0 }).toArray(),
            ).toEqual([
                { field: 'STRONGER', value: 'uid:/rock', count: 1 },
                { field: 'STRONGER', value: 'uid:/scissor', count: 1 },
                { field: 'STRONGER', value: 'uid:/paper', count: 1 },
            ]);
        });

        after(async () => {
            await clear();
        });
    });

    after(async () => {
        await close();
    });
});
