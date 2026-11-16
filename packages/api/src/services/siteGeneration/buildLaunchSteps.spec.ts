import { ObjectId } from 'mongodb';
import type { ModelLaunchStep } from '@lodex/common';
import { DATASET_ID } from '../../models/dataSource';
import type { Enrichment } from '../../models/enrichment';
import type { PreComputation } from '../../models/precomputed';
import { buildLaunchSteps } from './buildLaunchSteps';

const enrichment = (name: string, extra: Partial<Enrichment> = {}) =>
    ({ _id: new ObjectId(), name, ...extra }) as Enrichment;
const precomputed = (name: string) =>
    ({ _id: new ObjectId(), name }) as PreComputation;

const thesesLaunchOrder: ModelLaunchStep[] = [
    { name: 'clusterRameau', type: 'precomputed', position: 1 },
    { name: 'xml', type: 'enrichment', position: 2 },
    { name: 'resume', type: 'enrichment', position: 3 },
    { name: 'resumeEN', type: 'enrichment', position: 4 },
    { name: 'langueISO6391', type: 'enrichment', position: 5 },
    { name: 'lienHAL', type: 'enrichment', position: 6 },
    { name: 'lienDocument', type: 'enrichment', position: 7 },
    { name: 'teeft', type: 'enrichment', position: 8 },
    { name: 'AccesAuTexteIntegral', type: 'enrichment', position: 9 },
    { name: 'genre', type: 'enrichment', position: 10 },
    { name: 'hasDOI', type: 'enrichment', position: 11 },
];

describe('buildLaunchSteps', () => {
    it('builds the steps of a launchOrder with everything present', () => {
        const enrichments = thesesLaunchOrder
            .filter(({ type }) => type === 'enrichment')
            .map(({ name }) => enrichment(name))
            .reverse();
        const precomputeds = [precomputed('clusterRameau')];

        const steps = buildLaunchSteps({
            launchOrder: thesesLaunchOrder,
            enrichments,
            precomputeds,
            columnsByDataSource: {},
        });

        expect(steps).toHaveLength(11);
        expect(steps[0]).toEqual({
            name: 'clusterRameau',
            type: 'precomputed',
            targetId: precomputeds[0]._id.toString(),
            position: 1,
            attempts: 0,
        });
        expect(steps.map(({ position }) => position)).toEqual(
            thesesLaunchOrder.map(({ position }) => position),
        );
        const xml = enrichments.find(({ name }) => name === 'xml')!;
        expect(steps[1]).toMatchObject({
            name: 'xml',
            type: 'enrichment',
            targetId: xml._id!.toString(),
        });
    });

    it('ignores steps missing from the instance and does not launch what the launchOrder omits', () => {
        const steps = buildLaunchSteps({
            launchOrder: [
                { name: 'clusterRameau', type: 'precomputed', position: 1 },
                { name: 'xml', type: 'enrichment', position: 2 },
            ],
            enrichments: [enrichment('resume')],
            precomputeds: [],
            columnsByDataSource: {},
        });

        expect(steps).toEqual([]);
    });

    it('prefers the enrichment of the main dataset and warns on duplicates', () => {
        const other = enrichment('teeft', { dataSource: 'other' });
        const main = enrichment('teeft', { dataSource: DATASET_ID });
        const logger = { warn: jest.fn() };

        const steps = buildLaunchSteps(
            {
                launchOrder: [
                    { name: 'teeft', type: 'enrichment', position: 1 },
                ],
                enrichments: [other, main],
                precomputeds: [],
                columnsByDataSource: {},
            },
            logger,
        );

        expect(steps.map(({ targetId }) => targetId)).toEqual([
            main._id!.toString(),
        ]);
        expect(logger.warn).toHaveBeenCalled();
    });

    it('takes the first duplicate when none is on the main dataset', () => {
        const first = enrichment('teeft', { dataSource: 'a' });
        const second = enrichment('teeft', { dataSource: 'b' });

        const steps = buildLaunchSteps({
            launchOrder: [{ name: 'teeft', type: 'enrichment', position: 1 }],
            enrichments: [first, second],
            precomputeds: [],
            columnsByDataSource: {},
        });

        expect(steps.map(({ targetId }) => targetId)).toEqual([
            first._id!.toString(),
        ]);
    });

    it('orders by dependencies without a launchOrder', () => {
        const p1 = precomputed('P1');
        const p2 = precomputed('P2');
        const a = enrichment('A', { sourceColumn: 'col' });
        const b = enrichment('B', { sourceColumn: 'A' });

        const steps = buildLaunchSteps({
            enrichments: [b, a],
            precomputeds: [p1, p2],
            columnsByDataSource: { [DATASET_ID]: ['col'] },
        });

        expect(steps.map(({ name, position }) => [name, position])).toEqual([
            ['P1', 1],
            ['P2', 1],
            ['A', 2],
            ['B', 3],
        ]);
    });

    it('starts enrichments at 1 without precomputations', () => {
        const steps = buildLaunchSteps({
            enrichments: [enrichment('A')],
            precomputeds: [],
            columnsByDataSource: {},
        });
        expect(steps.map(({ position }) => position)).toEqual([1]);
    });

    it('returns nothing when there is nothing to launch', () => {
        expect(
            buildLaunchSteps({
                enrichments: [],
                precomputeds: [],
                columnsByDataSource: {},
            }),
        ).toEqual([]);
    });
});
