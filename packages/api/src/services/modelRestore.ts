import streamToString from 'stream-to-string';
import { SCOPE_GRAPHIC, type SiteInfo } from '@lodex/common';

import { getSiteTitleKey } from '../models/siteTitleKey';
import { getTheme } from '../models/themes';
import { ENRICHER } from '../workers/enricher';
import { PRECOMPUTER } from '../workers/precomputer';
import { dropJobs } from '../workers/tools';
import { restoreEnrichments } from './enrichment/enrichment';
import { mongoConnectionString } from './mongoClient';
import { restorePrecomputed } from './precomputed/precomputed';
import { restoreModel } from './restoreModel';

// Restoration of a model archive (or of a legacy fields JSON), shared by the
// model import of the admin and the model job of the site wizard

const sortByFieldUri = (a: any, b: any) =>
    (a.name === 'uri' ? -1 : a.position) - (b.name === 'uri' ? -1 : b.position);

// Only theme and front are exported with the model (see exportFields)
export const applyConfigTenant = async (ctx: any, imported: any) => {
    if (!imported) {
        return {};
    }

    const current = await ctx.configTenantCollection.findLast();
    if (!current) {
        return {};
    }
    const themeFound = !imported.theme || getTheme(imported.theme);

    // front.theme holds the theme's template variables: keep the current
    // ones when the imported theme cannot be applied
    const front =
        imported.front && !themeFound
            ? { ...imported.front, theme: current.front?.theme }
            : imported.front ?? current.front;

    await ctx.configTenantCollection.update(current._id, {
        ...current,
        front,
        theme: themeFound && imported.theme ? imported.theme : current.theme,
    });

    return themeFound ? {} : { themeNotFound: imported.theme };
};

// Same as the admin settings form: switching theme also resets front.theme
// to the variables of the new theme. When the restored archive already uses
// that theme, its customized variables are kept.
export const applyRecommendedTheme = async (
    ctx: any,
    theme: string,
): Promise<{ themeNotFound?: string }> => {
    const themeEntry = getTheme(theme);
    if (!themeEntry) {
        return { themeNotFound: theme };
    }

    const current = await ctx.configTenantCollection.findLast();
    // no configuration to apply the theme to, or already the right theme
    if (!current || current.theme === theme) {
        return {};
    }
    await ctx.configTenantCollection.update(current._id, {
        ...current,
        theme,
        front: { ...current.front, theme: themeEntry.customTemplateVariables },
    });

    return {};
};

const trimmedOrUndefined = (value: unknown) =>
    (typeof value === 'string' && value.trim()) || undefined;

/**
 * Write the site name and description into the theme variables, where the
 * theme settings edit them. An empty value, or a theme without the variable,
 * leaves the configuration as it is.
 */
export const applySiteInfo = async (ctx: any, siteInfo: SiteInfo) => {
    const siteName = trimmedOrUndefined(siteInfo.siteName);
    const siteDescription = trimmedOrUndefined(siteInfo.siteDescription);
    if (!siteName && !siteDescription) {
        return;
    }
    const current = await ctx.configTenantCollection.findLast();
    const themeVariables =
        current && getTheme(current.theme)?.customTemplateVariables;
    if (!themeVariables) {
        return;
    }
    const nameKey = getSiteTitleKey(current.front?.theme ?? {});
    // a legacy ISTEX configuration keeps its `title`: adding the default
    // `siteTitle` next to it would show two title variables in the editor
    const { siteTitle: _, ...legacyDefaults } = themeVariables;
    const defaults = nameKey === 'title' ? legacyDefaults : themeVariables;
    const values = {
        ...(siteName &&
            'siteTitle' in themeVariables && { [nameKey]: siteName }),
        ...(siteDescription &&
            'summary' in themeVariables && { summary: siteDescription }),
    };
    if (Object.keys(values).length === 0) {
        return;
    }
    await ctx.configTenantCollection.update(current._id, {
        ...current,
        front: {
            ...current.front,
            // the theme settings editor shows the stored variables only
            theme: { ...defaults, ...current.front?.theme, ...values },
        },
    });
};

export const translateOldField = (ctx: any, oldField: any, index: any) => {
    const {
        display_in_home,
        display_in_resource,
        display_in_graph,
        display_in_list,
        cover,
        name,
        ...newField
    } = oldField;
    const scope = display_in_graph && !display_in_home ? SCOPE_GRAPHIC : cover;
    const display =
        display_in_home || display_in_resource || display_in_graph
            ? true
            : false;

    if (display_in_graph && display_in_home) {
        ctx.field.create(
            {
                scope: SCOPE_GRAPHIC,
                display,
                ...newField,
                position: index,
            },
            name,
            false,
        );

        return ctx.field.create(
            {
                scope,
                display,
                ...newField,
                label: newField.label,
                transformers: [
                    {
                        operation: 'VALUE',
                        args: [
                            {
                                name: 'value',
                                type: 'string',
                                value: newField.label,
                            },
                        ],
                    },
                ],
                format: { name: 'fieldClone', args: { value: name } },
                position: index + 1,
            },
            '',
            false,
        );
    }
    const uriField = oldField.transformers.find(
        (transformer: any): any =>
            transformer && transformer.operation === 'AUTOGENERATE_URI',
    );
    if (uriField) {
        return ctx.field.create(
            {
                scope,
                display,
                ...newField,
                position: index,
                transformers: [
                    {
                        operation: 'COLUMN',
                        args: [
                            {
                                name: 'column',
                                type: 'column',
                                value: 'uri',
                            },
                        ],
                    },
                ],
            },
            name,
            false,
        );
    }

    return ctx.field.create(
        {
            scope,
            display,
            ...newField,
            position: index,
        },
        name,
        false,
    );
};

export const restoreFields = (fileStream: any, ctx: any) => {
    if (!fileStream.filename.endsWith('.tar')) {
        return streamToString(fileStream)
            .then((fieldsString: any) => JSON.parse(fieldsString))
            .then((fields: any) => {
                ctx.field
                    .deleteMany({})
                    .then(() =>
                        Promise.all(
                            fields
                                .sort(sortByFieldUri)
                                .map((field: any, index: any) =>
                                    translateOldField(ctx, field, index),
                                ),
                        ),
                    );
            });
    }

    const restoreTask = () => {
        dropJobs(ctx.tenant, ENRICHER);
        dropJobs(ctx.tenant, PRECOMPUTER);

        return restoreModel(mongoConnectionString(ctx.tenant), fileStream, [
            'field',
            'subresource',
            'enrichment',
            'precomputed',
        ]);
    };

    return ctx.field
        .deleteMany({})
        .then(restoreTask)
        .then(async ({ configTenant }: any) => {
            await Promise.all([
                ctx.field.castIds(),
                ctx.subresource.castIds(),
                restoreEnrichments(ctx),
                restorePrecomputed(ctx),
            ]);
            return applyConfigTenant(ctx, configTenant);
        });
};
