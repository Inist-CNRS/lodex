import Stream from 'stream';
// @ts-expect-error TS(2792): Cannot find module 'lodash/omit'. Did you mean to ... Remove this comment to see the full error message
import omit from 'lodash/omit';
// @ts-expect-error TS(2792): Cannot find module 'lodash/get'. Did you mean to s... Remove this comment to see the full error message
import get from 'lodash/get';
// @ts-expect-error TS(2792): Cannot find module 'lodash/set'. Did you mean to s... Remove this comment to see the full error message
import set from 'lodash/set';

import { saveParsedStream } from './saveParsedStream';
import {
    connect,
    loadFixtures,
    clear,
    close,
    // @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
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
            scope: 'collection',
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
            scope: 'collection',
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
            scope: 'collection',
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
    let db: any;
    beforeAll(async () => {
        db = await connect('lodex_test');
    });

    describe('optimal', () => {
        let ctx: any, parsedStream: any;
        const newDocuments = [
            { id: 4, name: 'spock', stronger_than: 1 },
            { id: 5, name: 'lizard', stronger_than: 3 },
        ];
        beforeAll(async () => {
            await loadFixtures(fixtures);

            parsedStream = new Stream.Transform({ objectMode: true });
            newDocuments.forEach((doc: any) => parsedStream.push(doc));
            parsedStream.push(null);
            const dataset = await datasetFactory(db);

            ctx = {
                dataset,
                publishedDataset: await publishedDataset(db),
                field: await field(db),
                publishedFacet: await publishedFacet(db),
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                saveStream: saveStream(dataset.insertMany.bind(dataset)),
                publishDocuments,
                publishFacets,
            };
        });

        it('should add new document to publication', async () => {
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            await saveParsedStream(ctx)(parsedStream);
            expect(await ctx.dataset.count()).toBe(5);
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
            expect(await ctx.publishedDataset.count()).toBe(5);

            const publishedDataset = await ctx.publishedDataset
                .find({}, { _id: 0 })
                .toArray();

            const cleanedPublishedDataset = publishedDataset.map(
                (
                    doc: any, // omit versions[0].publicationDate
                ) =>
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

        afterAll(async () => {
            await clear('lodex_test');
        });
    });

    describe('uri duplicate error', () => {
        let ctx: any, parsedStream: any;
        const newDocuments = [
            { id: 4, name: 'spock', stronger_than: 1 },
            { id: 5, name: 'lizard', stronger_than: 3 },
            { id: 1, name: 'rock', stronger_than: 2 }, // duplicate
        ];
        beforeAll(async () => {
            await loadFixtures(fixtures);

            parsedStream = new Stream.Transform({ objectMode: true });
            newDocuments.forEach((doc: any) => parsedStream.push(doc));
            parsedStream.push(null);
            const dataset = await datasetFactory(db);

            ctx = {
                dataset,
                publishedDataset: await publishedDataset(db),
                field: await field(db),
                publishedFacet: await publishedFacet(db),
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                saveStream: saveStream(dataset.insertMany.bind(dataset)),
                publishDocuments,
                publishFacets,
            };
        });

        it('should not add new document to publication', async () => {
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await saveParsedStream(ctx)(parsedStream).catch(
                (error: any) => error,
            );
            expect(error.message).toContain('E11000 duplicate key error');
            expect(error.message).toContain('dup key: { : "uid:/rock" }');

            expect(await ctx.dataset.count()).toBe(3);
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
            expect(await ctx.publishedDataset.count()).toBe(3);

            const publishedDataset = await ctx.publishedDataset
                .find({}, { _id: 0 })
                .toArray();

            const cleanedPublishedDataset = publishedDataset.map(
                (
                    doc: any, // omit versions[0].publicationDate
                ) =>
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

        afterAll(async () => {
            await clear('lodex_test');
        });
    });

    afterAll(async () => {
        await close();
    });
});
