import { Chip } from '@mui/material';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { type AvailableTheme } from './useGetAvailableThemes';

// only a theme of this instance can be recommended
export const getRecommendedTheme = (
    theme: string | undefined,
    themes: AvailableTheme[],
) => themes.find(({ value }) => value === theme)?.value;

// tags the recommended theme in a list of themes
export const RecommendedThemeChip = () => {
    const { translate } = useTranslate();
    return (
        <Chip
            label={translate('site_wizard_theme_recommended')}
            color="primary"
            size="small"
            sx={{ ml: 1 }}
        />
    );
};
