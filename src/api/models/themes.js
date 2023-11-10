import fs from 'node:fs';
import { jsHost, themesHost } from 'config';
import config from '../../../config.json';
import path from 'path';
import getLogger from '../services/logger';

const logger = getLogger('system');

const REGEX_JS_HOST = /\{\|__JS_HOST__\|\}/g;
const REGEX_THEMES_HOST = /\{\|__THEMES_HOST__\|\}/g;

/**
 * @type {Map<string, {name: {fr: string, en: string}, description: {fr: string, en: string}, index: string, customTheme: *}>}
 */
const loadedThemes = new Map();
/**
 * @type {Map<string, boolean>}
 */
const availableTheme = new Map();

/**
 * @param theme
 * @returns {{name: {fr: string, en: string}, description: {fr: string, en: string}, index: string, customTheme: *}}
 */
export const getTheme = theme => {
    return loadedThemes.get(theme);
};

/**
 * @returns {IterableIterator<string>}
 */
export const getAvailableTheme = () => {
    return availableTheme.keys();
};

/**
 * @param theme
 * @returns {boolean}
 */
export const isLoaded = theme => {
    return availableTheme.get(theme);
};

const initAvailableTheme = () => {
    availableTheme.set('default', false);
    for (const theme of config.themes) {
        availableTheme.set(theme, false);
    }
};

const init = async () => {
    // Default theme
    try {
        loadedThemes.set('default', {
            name: {
                fr: 'Classique',
                en: 'Classic',
            },
            description: {
                fr: 'Thème Lodex Classique',
                en: 'Classic Lodex theme',
            },
            index: fs
                .readFileSync(
                    path.resolve(__dirname, '../../app/custom/index.html'),
                )
                .toString()
                .replace(REGEX_JS_HOST, jsHost)
                .replace(REGEX_THEMES_HOST, themesHost),
            customTheme: await import('../../app/custom/customTheme').default,
        });
        availableTheme.set('default', true);
    } catch (e) {
        logger.error("Can't load default Lodex theme!");
        throw e;
    }

    // Load custom themes
    for (const theme of config.themes) {
        try {
            const uri = `themes/${theme}`;
            const themeConfig = await import(`../../${uri}/lodex-theme.json`);

            if (themeConfig.version !== '1') {
                logger.warn(
                    `The ${theme} theme version may not be compatible with the current Lodex version. Expected theme version: 1, current version: ${themeConfig.version}.`,
                );
                logger.warn(
                    'Lodex may attempt to load this theme. Please note that if you use this theme, it may cause visual problems.',
                );
            }

            let indexLocation = '../../app/custom/index.html';
            if (themeConfig?.files?.theme?.index) {
                indexLocation = `../../${uri}/${themeConfig?.files?.theme?.index}`;
            }

            let customThemeLocation = '../../app/custom/customTheme';
            if (themeConfig?.files?.theme?.main) {
                customThemeLocation = `../../${uri}/${themeConfig?.files?.theme?.main}`;
            }

            const index = fs
                .readFileSync(path.resolve(__dirname, indexLocation))
                .toString()
                .replace(REGEX_JS_HOST, jsHost)
                .replace(REGEX_THEMES_HOST, themesHost);

            // TODO: Fix this, currently it return only undefined
            const customTheme = await import(customThemeLocation).default;

            loadedThemes.set(theme, {
                name: themeConfig.name,
                description: themeConfig.description,
                index,
                customTheme,
            });
            availableTheme.set(theme, true);
        } catch (e) {
            logger.error(`unable to load ${theme} theme!`);
            logger.error(e);
        }
    }
};

initAvailableTheme();
init().then(() => {
    logger.info('Theme initialization finished');
});

export default getTheme;
