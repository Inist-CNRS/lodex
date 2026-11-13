import { createTheme } from '@mui/material/styles';
import ejs from 'ejs';
import { assign, escape } from 'lodash';
import fs from 'fs';
import path from 'path';
import { version } from '../../../../package.json';
import rootTheme from '../../../../src/app/custom/themes/rootTheme';
import { getSiteTitleKey } from './siteTitleKey';
import { getTheme } from './themes';
import { REPO_ROOT } from '../paths';

const buildCss = ([key, value]: [string, unknown]): unknown[] => {
    if (typeof value === 'object') {
        const prefix = key
            .split(/(?=[A-Z])/)
            .map((word) => word.toLowerCase())
            .join('-');
        // @ts-expect-error: TS1342
        return Object.entries(value)
            .flatMap(buildCss)
            .map((variable) => `${prefix}-${variable}`);
    }

    if (typeof value === 'number' || typeof value === 'string') {
        const prefix = key
            .split(/(?=[A-Z])/)
            .map((word) => word.toLowerCase())
            .join('-');
        return [`${prefix}:${value};`];
    }

    return [];
};

/**
 * Transform an object into css variable
 * @param {Object} cssObject
 */
// @ts-expect-error: TS7006
export const buildCssVariable = (cssObject) => {
    const css = [
        ':root{',
        ...Object.entries(cssObject)
            .flatMap(buildCss)
            .map((variable) => `--${variable}`),
        '}',
    ];
    return css.join('');
};

/**
 * Create a Mui theme from a lodex custom theme
 * @param {Partial<import('@mui/material/styles').Theme>} lodexTheme
 * @return {import('@mui/material/styles').Theme}
 */
// @ts-expect-error: TS7006
export const createMuiTheme = (lodexTheme) => {
    const theme = createTheme(lodexTheme);
    return assign(lodexTheme, theme);
};

// Themes are loaded once at boot: their css variables never change at runtime
const cssVariables = new WeakMap<object, string>();
const getCssVariable = (muiTheme: object): string => {
    if (!cssVariables.has(muiTheme)) {
        cssVariables.set(
            muiTheme,
            buildCssVariable(createMuiTheme(muiTheme).palette),
        );
    }
    return cssVariables.get(muiTheme) as string;
};

// Compiled templates are cached, and recompiled when the file changes on disk
// (themes can be edited at runtime). Included partials are not watched.
const templateMtimes = new Map<string, number>();
const invalidateChangedTemplate = (file: string) => {
    // a missing file is reported by ejs.renderFile below
    const mtimeMs = fs.statSync(file, { throwIfNoEntry: false })?.mtimeMs;
    if (templateMtimes.get(file) !== mtimeMs) {
        ejs.clearCache();
        templateMtimes.set(file, mtimeMs ?? 0);
    }
};

/**
 * @param {string} file
 * @param {any} data
 * @return {Promise<string>}
 */
// @ts-expect-error: TS7006
const renderTemplate = (file, data) => {
    return new Promise((resolve) => {
        invalidateChangedTemplate(file);
        ejs.renderFile(file, data, {
            async: true,
            cache: true,
            root: path.dirname(file),
        })
            .then(resolve)
            .catch((reason) => {
                resolve(`<!DOCTYPE html>
<html lang="en">
<head>
    <title>Server Side Rendering Error</title>
</head>
<body>
    <h1>Server Side Rendering Error</h1>
    <p>${escape(reason)}</p>
</body>
</html>`);
            });
    });
};

/**
 * @typedef {Object} RenderData
 * @property {string} jsHost
 * @property {string} themesHost
 * @property {string} tenant
 * @property {object?} preload
 * @property {string?} dbName
 * @property {string?} istexApi
 * @property {object?} customTemplateVariables
 */

/**
 * Site title set by the admin in the theme configuration.
 * The theme's own default is ignored: it is a placeholder ("Titre a modifier...").
 * The ISTEX themes name this variable `title`, the others `siteTitle`.
 */
export const getSiteTitle = (
    themeVariables: Record<string, unknown> = {},
    tenantVariables: Record<string, unknown> = {},
): string | null => {
    const key = getSiteTitleKey(themeVariables);
    const value = tenantVariables[key];
    if (typeof value !== 'string' || value === themeVariables[key]) {
        return null;
    }
    return value.trim() || null;
};

/**
 * Use the site title as the page <title>, and expose it to the public app
 * so that the tab titles it sets end with the site title instead of the tenant.
 */
export const injectSiteTitle = (html: string, siteTitle: string | null) => {
    if (!siteTitle) {
        return html;
    }
    // < prevents a "</script>" in the title from closing the script tag
    const json = JSON.stringify(siteTitle).replace(/</g, '\\u003c');
    return html.replace(
        /<title>[\s\S]*?<\/title>/,
        () =>
            `<title>${escape(siteTitle)}</title><script>window.__SITE_TITLE__ = ${json};</script>`,
    );
};

/**
 * @param {string} themeId
 * @param {RenderData} data
 * @return {Promise<string>}
 */
// @ts-expect-error: TS7006
export const renderPublic = (themeId, data) => {
    const lodexTheme = getTheme(themeId);
    if (!lodexTheme) {
        return new Promise((resolve) =>
            resolve(
                `<h1>The selected theme (${themeId}), no longer exists. Change it in <a href="./${data?.tenant}/admin#/config"> the configuration panel.</a></h1>`,
            ),
        );
    }
    const cssVariable = getCssVariable(lodexTheme.muiTheme);
    let themeFolder = themeId ?? 'default';
    if (!lodexTheme.hasIndex) {
        themeFolder = 'default';
    }

    const extendedData = {
        isDev: process.env.NODE_ENV === 'development',
        custom: {
            ...lodexTheme.customTemplateVariables,
            ...data.customTemplateVariables,
        },
        lodex: {
            version,
            base: { href: data.jsHost ?? '' },
            tenant: data.tenant ?? '',
            istexApi: data.istexApi ?? '',
            preload: data.preload ?? {},
        },
        theme: {
            cssVariable,
            current: {
                href: `${data.themesHost ?? ''}/themes/${themeFolder}`,
            },
            base: {
                href: `${data.themesHost ?? ''}/themes`,
            },
        },
        recaptchaClientKey: data.recaptchaClientKey,
    };

    const siteTitle = getSiteTitle(
        lodexTheme.customTemplateVariables,
        data.customTemplateVariables,
    );

    try {
        return renderTemplate(lodexTheme.index, extendedData).then((html) =>
            injectSiteTitle(html as string, siteTitle),
        );
    } catch (e) {
        if (themeId !== 'default') {
            return renderPublic('default', data);
        }
        return new Promise((resolve) =>
            resolve(
                '<h1>An unrecoverable HTML rendering error has occurred.</h1>',
            ),
        );
    }
};

/**
 * @param {RenderData} data
 * @return {Promise<string>}
 */
// @ts-expect-error: TS7006
export const renderAdmin = (data) => {
    const lodexTheme = getTheme('default');
    const cssVariable = getCssVariable(lodexTheme.muiTheme);

    const extendedData = {
        isDev: process.env.NODE_ENV === 'development',
        lodex: {
            version,
            base: { href: data.jsHost ?? '' },
            dbName: data.dbName ?? '',
            tenant: data.tenant ?? '',
        },
        theme: {
            cssVariable,
            current: {
                href: `${data.themesHost ?? ''}/themes/default`,
            },
            base: {
                href: `${data.themesHost ?? ''}/themes`,
            },
        },
    };

    return renderTemplate(
        path.join(REPO_ROOT, 'packages/api/src/admin.ejs'),
        extendedData,
    );
};

/**
 * @param {RenderData} data
 * @return {Promise<string>}
 */
// @ts-expect-error: TS7006
export const renderRootAdmin = (data) => {
    const cssVariable = getCssVariable(rootTheme);

    const extendedData = {
        isDev: process.env.NODE_ENV === 'development',
        lodex: {
            version,
            base: { href: data.jsHost ?? '' },
            dbName: data.dbName ?? '',
            tenant: data.tenant ?? '',
        },
        theme: {
            cssVariable,
            current: {
                href: `${data.themesHost ?? ''}/themes/default`,
            },
            base: {
                href: `${data.themesHost ?? ''}/themes`,
            },
        },
    };

    return renderTemplate(
        path.join(REPO_ROOT, 'packages/root-admin-app/index.ejs'),
        extendedData,
    );
};
