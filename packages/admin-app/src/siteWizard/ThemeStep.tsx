import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import { type CatalogModel } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import {
    getThemeLabel,
    type AvailableTheme,
} from '../configTenant/useGetAvailableThemes';

// the theme of a new instance, always installed
const DEFAULT_THEME = 'default';

// only a theme of this instance can be recommended
const getRecommendedTheme = (
    model: CatalogModel | undefined,
    themes: AvailableTheme[],
) => themes.find(({ value }) => value === model?.theme)?.value;

// the theme applied by the generation until the user picks another one,
// whatever the theme of the model's archive or of the instance. Without the
// list of themes, the recommended theme is sent as is: the server warns when
// it is not installed.
export const getPreselectedTheme = (
    model: CatalogModel | undefined,
    themes: AvailableTheme[] | undefined,
) =>
    (themes ? getRecommendedTheme(model, themes) : model?.theme) ??
    DEFAULT_THEME;

type ThemeStepProps = {
    model?: CatalogModel;
    themes?: AvailableTheme[];
    isLoading: boolean;
    hasError: boolean;
    theme: string;
    onThemeChange: (theme: string) => void;
};

export const ThemeStep = ({
    model,
    themes = [],
    isLoading,
    hasError,
    theme,
    onThemeChange,
}: ThemeStepProps) => {
    const { translate, locale } = useTranslate();
    const recommended = getRecommendedTheme(model, themes);
    const findTheme = (value: string) =>
        themes.find((available) => available.value === value);

    return (
        <Box>
            <Typography
                variant="h2"
                fontSize={20}
                color="text.primary"
                sx={{ mt: 2 }}
            >
                {translate('site_wizard_theme_title')}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
                {translate('site_wizard_theme_hint')}
            </Typography>
            {isLoading ? (
                <CircularProgress size={24} sx={{ mt: 3 }} />
            ) : hasError ? (
                <Alert severity="warning" sx={{ mt: 3 }}>
                    {translate('site_wizard_themes_error')}
                </Alert>
            ) : (
                <Select
                    value={findTheme(theme) ? theme : ''}
                    onChange={(event) => onThemeChange(event.target.value)}
                    // the recommended tag is for the list only
                    renderValue={(value) => {
                        const selected = findTheme(value);
                        return selected ? getThemeLabel(selected, locale) : '';
                    }}
                    inputProps={{
                        'aria-label': translate('site_wizard_theme_title'),
                    }}
                    sx={{ mt: 3, width: 'min(505px, 100%)' }}
                >
                    {themes.map((available) => (
                        <MenuItem key={available.value} value={available.value}>
                            {getThemeLabel(available, locale)}
                            {available.value === recommended && (
                                <Chip
                                    label={translate(
                                        'site_wizard_theme_recommended',
                                    )}
                                    color="primary"
                                    size="small"
                                    sx={{ ml: 1 }}
                                />
                            )}
                        </MenuItem>
                    ))}
                </Select>
            )}
        </Box>
    );
};
