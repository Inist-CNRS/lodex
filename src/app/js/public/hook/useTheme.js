import { useEffect, useState } from 'react';
import customTheme from '../../../custom/themes/default/customTheme';
import { themeLoader } from '../api/themeLoader';

/**
 * Hook use to get the application theme, return the default theme by default and if theme loader is successful return the custom theme
 * @returns {{palette: {secondary: {contrastText: string, main: string}, neutralDark: {secondary: string, veryLight: string, light: string, dark: string, lighter: string, main: string, veryDark: string, transparent: string}, success: {contrastText: string, main: string}, contrast: {light: string, main: string}, warning: {contrastText: string, main: string}, neutral: {main: string}, text: {main: string, primary: string}, danger: {contrastText: string, main: string}, contrastThreshold: number, primary: {secondary: string, light: string, contrastText: string, main: string}, info: {contrastText: string, main: string}}}}
 */
const useTheme = () => {
    const [theme, setTheme] = useState(customTheme);

    useEffect(() => {
        themeLoader().then(setTheme).catch(); // Catch error and do nothing with it
    }, []);

    return theme;
};

export default useTheme;
