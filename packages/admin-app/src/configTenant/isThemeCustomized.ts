import isEqual from 'lodash/isEqual';

import type { AvailableTheme } from './useGetAvailableThemes';

// The theme is customized when one of its variables differs from the theme's
// defaults (missing ones count as default), site name and description included. Unknown (config or themes not
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
        ([key, value]) => !isEqual(value, defaultVariables[key]),
    );
};
