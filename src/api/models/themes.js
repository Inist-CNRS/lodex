import fs from 'fs/promises';
import { jsHost, themesHost } from 'config';
import config from '../../../config.json';
import path from 'path';
import getLogger from '../services/logger';
import defaultCustomTheme from '../../app/custom/customTheme';
import deepClone from 'lodash.clonedeep';

const logger = getLogger('system');

const THEMES_VERSION = 2;

const REGEX_JS_HOST = /\{\|__JS_HOST__\|}/g;
const REGEX_THEMES_HOST = /\{\|__THEMES_HOST__\|}/g;

/**
 * @type {Map<string, {name: {fr: string, en: string}, description: {fr: string, en: string}, index: string, customTheme: *}>}
 */
const loadedThemes = new Map();
/**
 * @type {Map<string, boolean>}
 */
const availableThemes = new Map();

/**
 * @param theme
 * @returns {{name: {fr: string, en: string}, description: {fr: string, en: string}, index: string, customTheme: *}}
 */
export const getTheme = (theme = 'default') => {
    return loadedThemes.get(theme);
};

/**
 * @returns {*[]}
 */
export const getAvailableThemes = () => {
    const toReturn = [];
    loadedThemes.forEach((theme, value) => {
        toReturn.push({
            value,
            name: theme.name,
            description: theme.description,
        });
    });
    return toReturn;
};

/**
 * @returns {IterableIterator<string>}
 */
export const getAvailableThemesKeys = () => {
    return availableThemes.keys();
};

/**
 * @param theme
 * @returns {boolean}
 */
export const isLoaded = theme => {
    return availableThemes.get(theme);
};

const initAvailableThemes = () => {
    availableThemes.set('default', false);
    for (const theme of config.themes) {
        availableThemes.set(theme, false);
    }
};

const loadFile = async path =>
    (await fs.readFile(path))
        .toString('utf8')
        .replace(REGEX_JS_HOST, jsHost)
        .replace(REGEX_THEMES_HOST, themesHost);

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
            index: await loadFile(
                path.resolve(__dirname, '../../app/custom/index.html'),
            ),
            customTheme: defaultCustomTheme,
        });
        availableThemes.set('default', true);
    } catch (e) {
        logger.error("Can't load default Lodex theme!");
        throw e;
    }

    // Load custom themes
    for (const theme of config.themes) {
        try {
            const uri = `themes/${theme}`;
            const themeConfig = await import(`../../${uri}/lodex-theme.json`);

            if (themeConfig.version !== THEMES_VERSION) {
                logger.warn(
                    `The ${theme} theme version may not be compatible with the current Lodex version. Expected theme version: 1, current version: ${themeConfig.version}.`,
                );
                logger.warn(
                    'Lodex may attempt to load this theme. Please note that if you use this theme, it may cause visual problems.',
                );
            }

            let indexLocation = '../../app/custom/index.html';
            if (themeConfig?.files?.theme?.index) {
                indexLocation = `../../${uri}/${themeConfig.files.theme.index}`;
            }

            const index = await loadFile(
                path.resolve(__dirname, indexLocation),
            );

            let customTheme = deepClone(defaultCustomTheme);
            if (themeConfig?.files?.theme?.main) {
                Object.assign(
                    customTheme,
                    (
                        await import(
                            `../../${uri}/${themeConfig.files.theme.main}`
                        )
                    ).default,
                );
            }

            loadedThemes.set(theme, {
                name: themeConfig.name,
                description: themeConfig.description,
                index,
                customTheme,
            });
            availableThemes.set(theme, true);
        } catch (e) {
            logger.error(`unable to load ${theme} theme!`);
            logger.error(e);
        }
    }
};

initAvailableThemes();
init().then(() => {
    logger.info('Theme initialization finished');
});
