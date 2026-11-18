import { Chip, MenuItem } from '@mui/material';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { getThemeLabel, type AvailableTheme } from './useGetAvailableThemes';

type Locale = 'en' | 'fr';

// only a theme of this instance can be recommended
export const getRecommendedTheme = (
    theme: string | undefined,
    themes: AvailableTheme[],
) => themes.find(({ value }) => value === theme)?.value;

// tags the recommended theme in a list of themes
const RecommendedThemeChip = () => {
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

// the selected value of a theme Select: the recommended tag is for the list only
export const renderThemeValue =
    (themes: AvailableTheme[], locale: Locale) => (value: string) => {
        const selected = themes.find((theme) => theme.value === value);
        return selected ? getThemeLabel(selected, locale) : '';
    };

// the options of a theme Select, an array since Select reads its MenuItem children
export const renderThemeOptions = (
    themes: AvailableTheme[],
    locale: Locale,
    recommended: string | undefined,
) =>
    themes.map((theme) => (
        <MenuItem key={theme.value} value={theme.value}>
            {getThemeLabel(theme, locale)}
            {theme.value === recommended && <RecommendedThemeChip />}
        </MenuItem>
    ));
