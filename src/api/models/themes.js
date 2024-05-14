import { jsHost, themesHost } from 'config';
import config from '../../../config.json';
import path from 'path';
import { promisify } from 'util';
import getLogger from '../services/logger';
import defaultCustomTheme from '../../app/custom/themes/default/customTheme';
import { version } from '../../../package.json';
import deepClone from 'lodash/cloneDeep';
import get from 'lodash/get';
import ejs from 'ejs';

export const THEMES_VERSION = '3';
export const THEMES_FOLDER = '../../app/custom/themes';

const renderFile = promisify(ejs.renderFile);

const logger = getLogger('system');

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

export const getThemeFile = (theme, file) => {
    return `${THEMES_FOLDER}/${theme}/${file}`;
};

/**
 * @param theme
 * @returns {boolean}
 */
export const isLoaded = (theme) => {
    return availableThemes.get(theme);
};

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
             * @type {{
             *     version: string;
             *     restricted: boolean;
             *     name: {
             *         fr: string;
             *         en: string;
             *     };
             *     description: {
             *         fr: string;
             *         en: string;
             *     };
             *     files?: {
             *         theme?: {
             *             main?: string;
             *             index?: string;
             *         };
             *     };
             * }}
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
