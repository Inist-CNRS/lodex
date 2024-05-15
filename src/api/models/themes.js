import { jsHost, themesHost } from 'config';
import config from '../../../config.json';
import path from 'path';
import { promisify } from 'util';
import getLogger from '../services/logger';
import defaultCustomTheme from '../../app/custom/themes/default/defaultTheme';
import { version } from '../../../package.json';
import deepClone from 'lodash/cloneDeep';
import get from 'lodash/get';
import ejs from 'ejs';

// --- Global variable for the Theme system
export const THEMES_VERSION = '3';
export const THEMES_FOLDER = '../../app/custom/themes';

// --- Global function for the Theme system
const renderFile = promisify(ejs.renderFile);
const logger = getLogger('system');

// --- TypeScript without TypeScript (Required an ide with TypeScript support)
/**
 * @typedef {Partial<import('@mui/material/styles').Theme>} CustomTheme
 */

/**
 * @typedef {Object} ThemeConfig - Theme config file
 * @property {string} version - Version of the LODEX theme system
 * @property {{
 *     fr: string;
 *     en: string
 * }} name - Name of the theme
 * @property {{
 *     fr: string;
 *     en: string
 * }} description - Short description about the theme
 * @property {{
 *     theme: {
 *         main: string;
 *         index: string;
 *     };
 * }} file - Optional option for the theme system
 */

/**
 * @typedef {Object} ThemeEntry - Theme object use to store the theme
 * @property {{
 *     fr: string;
 *     en: string
 * }} name - Name of the theme
 * @property {{
 *     fr: string;
 *     en: string
 * }} description - Short description about the theme
 * @property {string} index - Html index file
 * @property {CustomTheme} customTheme - Mui theme
 */

/**
 * @typedef {Object} ThemeDescription
 * @property {string} value - ID of the theme
 * @property {{
 *     fr: string;
 *     en: string
 * }} name - Name of the theme
 * @property {{
 *     fr: string;
 *     en: string
 * }} description - Short description about the theme
 */

// --- Theme storage
/**
 * @type {Map<string, ThemeEntry>}
 */
const loadedThemes = new Map();
/**
 * @type {Map<string, boolean>}
 */
const availableThemes = new Map();

// --- Theme accessing
/**
 * @param theme
 * @returns {ThemeEntry}
 */
export const getTheme = (theme = 'default') => {
    return loadedThemes.get(theme);
};

/**
 * @returns {ThemeDescription[]}
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
 * @deprecated
 * @returns {IterableIterator<string>}
 */
export const getAvailableThemesKeys = () => {
    return availableThemes.keys();
};

export const getThemeFile = (theme, file) => {
    return `${THEMES_FOLDER}/${theme}/${file}`;
};

/**
 * @deprecated
 * @param theme
 * @returns {boolean}
 */
export const isLoaded = (theme) => {
    return availableThemes.get(theme);
};

// --- Theme initialisation
const initAvailableThemes = () => {
    availableThemes.set('default', false);
    for (const theme of config.themes) {
        availableThemes.set(theme, false);
    }
};

const loadFile = async (themeFile, themeConfig = {}) => {
    const ejsOptions = {
        async: true,
        root: path.dirname(themeFile),
    };
    const themeData = {
        lodex: {
            version,
            base: { href: jsHost },
        },
        theme: {
            ...themeConfig,
            base: { href: themesHost },
        },
    };
    return await renderFile(themeFile, themeData, ejsOptions);
};

const init = async () => {
    // Default theme
    const themes = Array.from(new Set([...config.themes, 'default'])).filter(
        Boolean,
    );

    // Load custom themes
    for (const theme of themes) {
        try {
            /**
             * @type {ThemeConfig}
             */
            const themeConfig = await import(
                getThemeFile(theme, 'lodex-theme.json')
            );

            if (themeConfig.version !== THEMES_VERSION) {
                themeConfig.description = {
                    fr: themeConfig.description.fr + ' (thème obsolète)',
                    en: themeConfig.description.en + ' (outdated theme)',
                };

                logger.warn(
                    `The ${theme} theme version may not be compatible with the current LODEX version.`,
                );
                logger.warn(
                    `Expected theme version: ${THEMES_VERSION}, current version: ${themeConfig.version}.`,
                );
                logger.warn(
                    'LODEX may attempt to load this theme. Please note that if you use this theme, it may cause visual problems.',
                );
            }

            let indexLocation = getThemeFile('default', 'index.html');
            if (themeConfig?.files?.theme?.index) {
                indexLocation = getThemeFile(
                    theme,
                    themeConfig.files.theme.index,
                );
            }

            const themeLocalConfig = get(config, `theme.${theme}`, {});
            const index = await loadFile(
                path.resolve(__dirname, indexLocation),
                { ...themeConfig, ...themeLocalConfig },
            );

            let customTheme = deepClone(defaultCustomTheme);
            if (themeConfig?.files?.theme?.main) {
                Object.assign(
                    customTheme,
                    (
                        await import(
                            getThemeFile(theme, themeConfig.files.theme.main)
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
