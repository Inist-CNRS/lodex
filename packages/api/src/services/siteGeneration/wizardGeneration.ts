import {
    countLaunchSteps,
    type ModelLaunchStep,
    type SiteWizardChoice,
} from '@lodex/common';
import getLogger from '../logger';
import { findCatalogModel } from '../catalogModel';
import { randomUUID } from 'node:crypto';
import type {
    SiteGeneration,
    SiteGenerationStep,
    SiteGenerationUpdate,
} from '../../models/siteGeneration';
import { buildLaunchSteps, firstPosition } from './buildLaunchSteps';
import {
    applyRecommendedTheme,
    applySiteInfo,
    restoreFields,
} from '../modelRestore';
import { advanceSiteGeneration, stopSiteGeneration } from './siteGeneration';
import { failWizardGeneration, queueModelImport } from './wizardJobs';

export type WizardGenerationError = {
    status: 404 | 400;
    error: 'model_not_found' | 'model_archive_not_tar';
};

// Validates the model chosen in the wizard (same rules as the import of a
// catalog model), then starts the generation, in its data phase. The catalog
// has no display name: the id stands for it, the admin translates it. The
// caller queues the import with `importJobId` as job id.
export const startWizardGeneration = async (
    ctx: any,
    choice: SiteWizardChoice,
    importJobId: string,
): Promise<{ runId: string } | WizardGenerationError> => {
    const model = findCatalogModel(
        ctx.catalogModels,
        choice.modelId,
        ctx.availableLoaders,
    );
    if (!model) {
        return { status: 404, error: 'model_not_found' };
    }
    if (!new URL(model.url).pathname.endsWith('.tar')) {
        return { status: 400, error: 'model_archive_not_tar' };
    }

    // A generation still running would point to targets the model replaces
    try {
        await stopSiteGeneration(ctx);
    } catch (e) {
        getLogger(ctx.tenant).error('Site generation stop error', {
            error: (e as Error).message,
        });
    }

    const generation = await ctx.siteGeneration.startWizard({
        choice,
        importJobId,
        estimate: model.launchOrder
            ? {
                  enrichment: countLaunchSteps(model, 'enrichment'),
                  precomputed: countLaunchSteps(model, 'precomputed'),
              }
            : undefined,
    });
    return { runId: generation.runId };
};

export type WizardImportOutcome =
    | { success: true }
    | {
          success: false;
          cancelled: boolean;
          // a translation key, and the technical error behind it
          message: string;
          detail?: string;
      };

// Best effort: the periodic pass launches it anyway (it is concurrency safe)
const advanceNow = async (ctx: any) => {
    try {
        await advanceSiteGeneration(ctx);
    } catch (e) {
        getLogger(ctx.tenant).error('Site generation advance error', {
            error: (e as Error).message,
        });
    }
};

// The rows are in: whatever fails from here, the generation ends in error in
// its launch phase, so that « Réessayer » relaunches it and not the import
const failDataAddLaunch = async (
    ctx: any,
    runId: string,
    steps: SiteGenerationStep[],
    message: string,
) => {
    try {
        const latest: SiteGeneration | null =
            await ctx.siteGeneration.findCurrent();
        // a run stopped meanwhile (« Arrêter ») is left as it is
        if (latest?.runId !== runId || latest.status !== 'running') {
            return;
        }
        // the transition was committed though it threw: go on
        if (latest.phase === 'launch') {
            await advanceNow(ctx);
            return;
        }
        if (latest.phase === 'data') {
            await ctx.siteGeneration.transition(latest, {
                status: 'error',
                phase: 'launch',
                position: firstPosition(steps),
                message,
            });
        }
    } catch (e) {
        getLogger(ctx.tenant).error('Site generation failure write error', {
            error: (e as Error).message,
        });
    }
};

// A data add has no model to restore: its steps are already known, the
// launch phase starts right after the import
const launchDataAdd = async (ctx: any, current: SiteGeneration) => {
    const steps = current.steps ?? [];
    // only informative: a failure of the count does not stop the launch
    let importedLines: number | undefined;
    try {
        importedLines = await ctx.dataset.estimatedDocumentCount();
    } catch (e) {
        getLogger(ctx.tenant).error('Site generation count error', {
            error: (e as Error).message,
        });
    }
    try {
        const moved = await ctx.siteGeneration.transition(current, {
            phase: 'launch',
            ...(importedLines !== undefined && { importedLines }),
            position: firstPosition(steps),
        });
        if (!moved) {
            return;
        }
    } catch (e) {
        await failDataAddLaunch(
            ctx,
            current.runId,
            steps,
            (e as Error).message,
        );
        return;
    }
    await advanceNow(ctx);
};

// The data import of the generation `runId` ended. Only a running generation
// in its data phase, of that very run, is concerned: a manual import (no
// runId) or one of an older run leaves the generation alone.
export const onWizardImportEnd = async (
    ctx: any,
    runId: string | undefined,
    outcome: WizardImportOutcome,
): Promise<void> => {
    if (!runId) {
        return;
    }
    const current = await ctx.siteGeneration.findCurrent();
    if (
        !current ||
        current.runId !== runId ||
        current.status !== 'running' ||
        current.phase !== 'data'
    ) {
        return;
    }

    if (outcome.success && current.kind === 'addData') {
        await launchDataAdd(ctx, current);
        return;
    }

    if (outcome.success) {
        // Whatever fails here, the generation must not wait forever
        try {
            const modelJobId = randomUUID();
            const importedLines = await ctx.dataset.estimatedDocumentCount();
            const moved = await ctx.siteGeneration.transition(current, {
                phase: 'model',
                modelJobId,
                importedLines,
            });
            // null: another process already moved the generation
            if (moved) {
                await queueModelImport(ctx, runId, modelJobId);
            }
        } catch (e) {
            await failWizardGeneration(ctx, runId, (e as Error).message);
        }
        return;
    }

    await ctx.siteGeneration.transition(
        current,
        outcome.cancelled
            ? { status: 'stopped' }
            : {
                  status: 'error',
                  message: outcome.message,
                  ...(outcome.detail && { detail: outcome.detail }),
              },
    );
};

// « Arrêter » leaves the run in `stopping`: its model job is the one to end
// it. Re-reads the generation and stops the run if it is stopping. True when
// it was: the job then does nothing more.
const settleIfStopping = async (ctx: any, runId: string): Promise<boolean> => {
    const latest: SiteGeneration | null =
        await ctx.siteGeneration.findCurrent();
    if (latest?.runId !== runId || latest.status !== 'stopping') {
        return false;
    }
    await ctx.siteGeneration.transition(latest, { status: 'stopped' });
    return true;
};

// A transition of the model job loses only to another process. When that
// process is « Arrêter » (status stopping), the job is the one to end the
// generation: it is stopped and nothing more is done.
const transitionRun = async (
    ctx: any,
    snapshot: SiteGeneration,
    update: SiteGenerationUpdate,
): Promise<SiteGeneration | null> => {
    const moved = await ctx.siteGeneration.transition(snapshot, update);
    if (moved) {
        return moved;
    }
    await settleIfStopping(ctx, snapshot.runId);
    return null;
};

export const readLaunchSteps = async (
    ctx: any,
    launchOrder: ModelLaunchStep[] | undefined,
): Promise<SiteGenerationStep[]> => {
    const [enrichments, precomputeds, dataSources] = await Promise.all([
        ctx.enrichment.findAll(),
        ctx.precomputed.findAll(),
        ctx.dataSource.getDataSources(),
    ]);
    const columnsByDataSource: Record<string, string[]> = {};
    for (const dataSource of dataSources) {
        columnsByDataSource[dataSource.id] = dataSource.columns.map(
            ({ name }: { name: string }) => name,
        );
    }
    return buildLaunchSteps(
        {
            launchOrder,
            enrichments,
            precomputeds,
            columnsByDataSource,
        },
        getLogger(ctx.tenant),
    );
};

// The job of the model phase: restores the model chosen in the wizard
// (phase model), applies the theme, name and description (phase settings),
// then hands the generation over to its launch phase. A failure puts the
// generation in error in the phase it reached.
export const importWizardModel = async (
    ctx: any,
    runId: string,
): Promise<void> => {
    const current: SiteGeneration | null =
        await ctx.siteGeneration.findCurrent();
    if (!current || current.runId !== runId || current.phase !== 'model') {
        return;
    }
    if (await settleIfStopping(ctx, runId)) {
        return;
    }
    if (current.status !== 'running') {
        return;
    }

    const { modelId, siteName, siteDescription, theme } = current.choice ?? {
        modelId: '',
    };
    let snapshot = current;
    try {
        const model = findCatalogModel(
            ctx.catalogModels,
            modelId,
            ctx.availableLoaders,
        );
        if (!model) {
            throw new Error('model_not_found');
        }
        const fileStream = await ctx.downloadModelArchive(model.url);
        // A restoration cannot be stopped halfway: « Arrêter » during the
        // download ends the generation before anything is replaced
        if (await settleIfStopping(ctx, runId)) {
            return;
        }
        // forgotten before: a restore failing halfway leaves a mixed model
        await ctx.siteModel.forget();
        const restored = (await restoreFields(fileStream, ctx)) ?? {};
        await ctx.siteModel.remember(modelId);

        const inSettings = await transitionRun(ctx, snapshot, {
            phase: 'settings',
        });
        if (!inSettings) {
            return;
        }
        snapshot = inSettings;

        // The theme chosen in the wizard, else the catalog one, overrides
        // the archive's one: its result fully replaces the archive's
        // themeNotFound, which would be misleading
        let themeNotFound: string | undefined = restored.themeNotFound;
        const themeToApply = theme || model.theme;
        if (themeToApply) {
            const applied = await applyRecommendedTheme(ctx, themeToApply);
            themeNotFound = applied.themeNotFound;
        }
        // after the theme: applying it resets the theme variables
        try {
            await applySiteInfo(ctx, { siteName, siteDescription });
        } catch (e) {
            // optional: the admin can still set them in the theme settings
            getLogger(ctx.tenant).error('Site info write error', {
                error: (e as Error).message,
            });
        }

        const steps = await readLaunchSteps(ctx, model.launchOrder);
        // without steps, the launch phase ends the generation, or publishes
        // the site first
        const launched = await transitionRun(ctx, snapshot, {
            phase: 'launch',
            ...(themeNotFound && { themeNotFound }),
            steps,
            position: firstPosition(steps),
        });
        if (!launched) {
            return;
        }
    } catch (e) {
        await transitionRun(ctx, snapshot, {
            status: 'error',
            message: (e as Error).message,
        });
        return;
    }

    // Launch the first position now rather than at the next periodic pass
    await advanceNow(ctx);
};
