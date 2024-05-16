import { createTheme } from '@mui/material/styles';
import { assign } from 'lodash';

/**
 * @param {string} key
 * @param {any} value
 * @return {string[]}
 */
const buildCss = ([key, value]) => {
    if (typeof value === 'object') {
        const prefix = key
            .split(/(?=[A-Z])/)
            .map((word) => word.toLowerCase())
            .join('-');
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
export const createMuiTheme = (lodexTheme) => {
    const theme = createTheme(lodexTheme);
    return assign(lodexTheme, theme);
};
