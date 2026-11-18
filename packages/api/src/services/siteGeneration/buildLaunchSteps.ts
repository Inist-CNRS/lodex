import groupBy from 'lodash/groupBy';
import type { ModelLaunchStep, ModelLaunchStepType } from '@lodex/common';
import { DATASET_ID } from '../../models/dataSource';
import type { Enrichment } from '../../models/enrichment';
import type { PreComputation } from '../../models/precomputed';
import type { SiteGenerationStep } from '../../models/siteGeneration';
import { orderEnrichmentsByDependencies } from '../orderEnrichmentsByDependencies';

type BuildLaunchStepsParams = {
    launchOrder?: ModelLaunchStep[];
    enrichments: Enrichment[];
    precomputeds: PreComputation[];
    columnsByDataSource: Record<string, string[]>;
};

type Logger = { warn(msg: string): void };

const toStep = (
    name: string,
    type: SiteGenerationStep['type'],
    id: unknown,
    position: number,
): SiteGenerationStep => ({
    name,
    type,
    targetId: String(id),
    position,
    attempts: 0,
});

const isMainDataset = (enrichment: Enrichment) =>
    !enrichment.dataSource || enrichment.dataSource === DATASET_ID;

const pickEnrichmentByName = (
    enrichments: Enrichment[],
    logger?: Logger,
): Map<string, Enrichment> => {
    const byName = new Map<string, Enrichment>();
    const grouped = groupBy(enrichments, 'name');
    for (const [name, candidates] of Object.entries(grouped)) {
        if (candidates.length > 1) {
            logger?.warn(
                `Several enrichments are named "${name}", only one is launched`,
            );
        }
        byName.set(name, candidates.find(isMainDataset) ?? candidates[0]);
    }
    return byName;
};

export const buildLaunchSteps = (
    {
        launchOrder,
        enrichments,
        precomputeds,
        columnsByDataSource,
    }: BuildLaunchStepsParams,
    logger?: Logger,
): SiteGenerationStep[] => {
    if (launchOrder) {
        const enrichmentsByName = pickEnrichmentByName(enrichments, logger);
        const precomputedsByName = new Map(
            precomputeds.map((precomputed) => [precomputed.name, precomputed]),
        );

        const steps = launchOrder.flatMap(({ name, type, position }) => {
            const target =
                type === 'precomputed'
                    ? precomputedsByName.get(name)
                    : enrichmentsByName.get(name);
            return target ? [toStep(name, type, target._id, position)] : [];
        });

        return sortSteps(steps);
    }

    const precomputedSteps = precomputeds.map((precomputed) =>
        toStep(precomputed.name, 'precomputed', precomputed._id, 1),
    );

    const enrichmentsByDataSource = groupBy(
        enrichments,
        (enrichment) => enrichment.dataSource || DATASET_ID,
    );
    const orderedEnrichments = Object.entries(enrichmentsByDataSource).flatMap(
        ([dataSource, group]) =>
            orderEnrichmentsByDependencies(
                columnsByDataSource[dataSource] ?? [],
                group,
            ),
    );
    const firstEnrichmentPosition = precomputedSteps.length ? 2 : 1;
    const enrichmentSteps = orderedEnrichments.map((enrichment, index) =>
        toStep(
            enrichment.name,
            'enrichment',
            enrichment._id,
            firstEnrichmentPosition + index,
        ),
    );

    return sortSteps([...precomputedSteps, ...enrichmentSteps]);
};

// Array.prototype.sort is stable: the original order is kept on ties
const sortSteps = (steps: SiteGenerationStep[]) =>
    [...steps].sort(
        (a, b) =>
            a.position - b.position ||
            Number(b.type === 'precomputed') - Number(a.type === 'precomputed'),
    );

export const countStepsByType = (
    steps: Pick<SiteGenerationStep, 'type'>[],
): Record<ModelLaunchStepType, number> => ({
    enrichment: steps.filter(({ type }) => type === 'enrichment').length,
    precomputed: steps.filter(({ type }) => type === 'precomputed').length,
});

// The position the launch phase starts at: the lowest one, 0 without steps
export const firstPosition = (
    steps: Pick<SiteGenerationStep, 'position'>[],
): number =>
    steps.length ? Math.min(...steps.map(({ position }) => position)) : 0;
