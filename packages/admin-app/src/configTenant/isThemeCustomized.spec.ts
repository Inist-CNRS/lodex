import { isThemeCustomized } from './isThemeCustomized';

const theme = (value: string, defaultVariables = {}) => ({
    value,
    name: { en: value, fr: value },
    description: { en: '', fr: '' },
    defaultVariables,
});

const themes = [
    theme('default', { siteTitle: '', summary: '' }),
    theme('istex', { title: '', color: 'blue', headerMenu: { links: [] } }),
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

    it('compares object variables by value', () => {
        expect(
            isThemeCustomized(
                {
                    theme: 'istex',
                    front: { theme: { headerMenu: { links: [] } } },
                },
                themes,
            ),
        ).toBe(false);
        expect(
            isThemeCustomized(
                {
                    theme: 'istex',
                    front: { theme: { headerMenu: { links: ['/a'] } } },
                },
                themes,
            ),
        ).toBe(true);
    });

    it('counts a site name or description as a customization', () => {
        expect(
            isThemeCustomized(
                {
                    theme: 'default',
                    front: { theme: { siteTitle: 'Mon site' } },
                },
                themes,
            ),
        ).toBe(true);
        expect(
            isThemeCustomized(
                { theme: 'default', front: { theme: { summary: 'Desc' } } },
                themes,
            ),
        ).toBe(true);
        expect(
            isThemeCustomized(
                { theme: 'istex', front: { theme: { title: 'Mon site' } } },
                themes,
            ),
        ).toBe(true);
        expect(
            isThemeCustomized(
                {
                    theme: 'default',
                    front: { theme: { siteTitle: '', summary: '' } },
                },
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
