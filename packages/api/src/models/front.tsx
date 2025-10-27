import { createTheme } from '@mui/material/styles';
import ejs from 'ejs';
import { assign, escape } from 'lodash';
import path from 'path';
import { version } from '../../../../package.json';
import rootTheme from '../../../../src/app/custom/themes/rootTheme';
import { getTheme } from './themes';

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

/**
 * @param {string} file
 * @param {any} data
 * @return {Promise<string>}
 */
// @ts-expect-error: TS7006
const renderTemplate = (file, data) => {
    return new Promise((resolve) => {
        ejs.renderFile(file, data, {
            async: true,
            beautify: true,
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
    const theme = createMuiTheme(lodexTheme.muiTheme);
    const cssVariable = buildCssVariable(theme.palette);
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

    try {
        return renderTemplate(lodexTheme.index, extendedData);
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
    const theme = createMuiTheme(lodexTheme.muiTheme);
    const cssVariable = buildCssVariable(theme.palette);

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
        path.resolve(__dirname, '../../../../src/app/admin.ejs'),
        extendedData,
    );
};

/**
 * @param {RenderData} data
 * @return {Promise<string>}
 */
// @ts-expect-error: TS7006
export const renderRootAdmin = (data) => {
    const theme = createMuiTheme(rootTheme);
    const cssVariable = buildCssVariable(theme.palette);

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
        path.resolve(__dirname, '../../../root-admin-app/index.ejs'),
        extendedData,
    );
};
