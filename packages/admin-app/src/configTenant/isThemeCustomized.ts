import type { AvailableTheme } from './useGetAvailableThemes';

// written by the site wizard (applySiteInfo), not a theme customization
const SITE_INFO_VARIABLES = ['title', 'siteTitle', 'summary'];

// The theme is customized when one of its variables differs from the theme's
// defaults (missing ones count as default). Unknown (config or themes not
// loaded) counts as customized, so the export prompt errs on the safe side.
export const isThemeCustomized = (
    config?: { theme?: string; front?: { theme?: Record<string, unknown> } },
    availableThemes?: AvailableTheme[],
) => {
    if (!config || !availableThemes) {
        return true;
    }
    const defaultVariables =
        availableThemes.find(({ value }) => value === config.theme)
            ?.defaultVariables ?? {};
    return Object.entries(config.front?.theme ?? {}).some(
        ([key, value]) =>
            !SITE_INFO_VARIABLES.includes(key) &&
            value !== defaultVariables[key],
    );
};
