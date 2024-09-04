import config from '../../../config.json';
import path from 'path';
import getLogger from '../services/logger';
import defaultMuiTheme from '../../app/custom/themes/default/defaultTheme';
import { cloneDeep, merge } from 'lodash';

import fs from 'fs/promises';

// --- Global variable for the Theme system
export const THEMES_VERSION = '7';
export const THEMES_FOLDER = '../../app/custom/themes';

// --- Global function for the Theme system
const logger = getLogger('system');

// --- TypeScript without TypeScript (Required an ide with TypeScript support)
/**
 * @typedef {Partial<import('@mui/material/styles').Theme>} MuiTheme
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
 *     files: {
 *         index: string;
 *         palette: string;
 *     };
 *     variables?: Record<string, string>
 * }} configuration - Optional option for the theme system
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
 * @property {string} index - Html index file location
 * @property {MuiTheme} muiTheme - Mui theme
 * @property {boolean} hasIndex - indicate if the theme have an index file
 * @property {object} customTemplateVariables - Default value of custom variables use in the ejs template
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
            defaultVariables: theme.customTemplateVariables,
        });
    });
    return toReturn;
};

export const getThemeFile = (theme, file) => {
    return path.resolve(__dirname, `${THEMES_FOLDER}/${theme}/${file}`);
};

// --- Theme initialisation
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

            let hasIndex = false;
            let indexLocation = getThemeFile('default', 'index.ejs');
            if (themeConfig?.configuration?.files?.index) {
                const unVerifiedIndexLocation = getThemeFile(
                    theme,
                    themeConfig.configuration.files.index,
                );

                try {
                    await fs.access(unVerifiedIndexLocation, fs.constants.R_OK);
                    indexLocation = unVerifiedIndexLocation;
                    hasIndex = true;
                } catch (_) {
                    logger.warn(
                        `The declared index file from ${theme} do not exists`,
                    );
                }
            }

            let muiTheme = cloneDeep(defaultMuiTheme);
            if (themeConfig?.configuration?.files?.palette) {
                const unVerifiedMuiTheme = getThemeFile(
                    theme,
                    themeConfig.configuration.files.palette,
                );

                try {
                    await fs.access(unVerifiedMuiTheme, fs.constants.R_OK);
                    muiTheme = merge(
                        muiTheme,
                        (await import(unVerifiedMuiTheme)).default,
                    );
                } catch (_) {
                    logger.warn(
                        `The declared palette file from ${theme} do not exists`,
                    );
                }
            }

            let customTemplateVariables = {};
            if (themeConfig?.configuration?.variables) {
                customTemplateVariables = themeConfig.configuration.variables;
            }

            loadedThemes.set(theme, {
                name: themeConfig.name,
                description: themeConfig.description,
                index: indexLocation,
                muiTheme,
                customTemplateVariables,
                hasIndex,
            });
        } catch (e) {
            logger.error(`unable to load ${theme} theme!`);
            logger.error(e);
        }
    }
};

init().then(() => {
    logger.info('Theme initialization finished');
});
