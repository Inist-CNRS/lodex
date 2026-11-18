import { getRecommendedTheme } from './recommendedTheme';
import { type AvailableTheme } from './useGetAvailableThemes';

const themes = [
    {
        value: 'default',
        name: { fr: 'Système', en: 'System' },
        description: { fr: 'Thème système', en: 'System theme' },
        defaultVariables: {},
    },
    {
        value: 'nougat',
        name: { fr: 'Nougat', en: 'Nougat' },
        description: { fr: 'Thème Nougat', en: 'Nougat theme' },
        defaultVariables: {},
    },
] as AvailableTheme[];

describe('getRecommendedTheme', () => {
    it('returns the theme when it is installed', () => {
        expect(getRecommendedTheme('nougat', themes)).toBe('nougat');
    });

    it('returns undefined when the theme is not installed', () => {
        expect(getRecommendedTheme('hal', themes)).toBeUndefined();
    });

    it('returns undefined without theme', () => {
        expect(getRecommendedTheme(undefined, themes)).toBeUndefined();
    });
});
