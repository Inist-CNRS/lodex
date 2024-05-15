import { useEffect, useState } from 'react';
import customTheme from '../../../custom/themes/default/defaultTheme';
import { themeLoader } from '../api/themeLoader';

/**
 * Hook use to get the application theme, return the default theme by default and if theme loader is successful return the custom theme
 * @return {{palette: import('@mui/material/styles').Theme['palette']}}
 */
const useTheme = () => {
    const [theme, setTheme] = useState(customTheme);

    useEffect(() => {
        themeLoader().then(setTheme).catch(); // Catch error and do nothing with it
    }, []);

    return theme;
};

export default useTheme;
