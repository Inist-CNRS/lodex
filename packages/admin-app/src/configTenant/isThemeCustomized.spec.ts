import { isThemeCustomized } from './isThemeCustomized';

const theme = (value: string, defaultVariables = {}) => ({
    value,
    name: { en: value, fr: value },
    description: { en: '', fr: '' },
    defaultVariables,
});

const themes = [
    theme('default', { siteTitle: '', summary: '' }),
    theme('istex', { title: '', color: 'blue' }),
];

describe('isThemeCustomized', () => {
    it('is true while the config or the themes are not loaded', () => {
        expect(isThemeCustomized(undefined, themes)).toBe(true);
        expect(isThemeCustomized({ theme: 'istex' }, undefined)).toBe(true);
    });

    it('is false for a theme with default or missing variables', () => {
        expect(isThemeCustomized({ theme: 'default' }, themes)).toBe(false);
        expect(
            isThemeCustomized(
                { theme: 'istex', front: { theme: { color: 'blue' } } },
                themes,
            ),
        ).toBe(false);
    });

    it('ignores the site name and description set by the site wizard', () => {
        expect(
            isThemeCustomized(
                {
                    theme: 'default',
                    front: {
                        theme: { siteTitle: 'Mon site', summary: 'Desc' },
                    },
                },
                themes,
            ),
        ).toBe(false);
        expect(
            isThemeCustomized(
                { theme: 'istex', front: { theme: { title: 'Mon site' } } },
                themes,
            ),
        ).toBe(false);
    });

    it('is true when a variable differs from the theme defaults', () => {
        expect(
            isThemeCustomized(
                { theme: 'istex', front: { theme: { color: 'red' } } },
                themes,
            ),
        ).toBe(true);
    });
});
