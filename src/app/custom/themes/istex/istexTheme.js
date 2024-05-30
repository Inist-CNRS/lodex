/**
 * LODEX ISTEX Theme
 * @licence All Right Reserved
 */

/**
 * LODEX use Mui theme
 * See this link to look a mui configuration
 * https://mui.com/material-ui/customization/theming/
 * https://mui.com/material-ui/customization/palette/
 * https://mui.com/material-ui/customization/default-theme/
 * https://zenoo.github.io/mui-theme-creator/
 * @type {import('@mui/material/styles').Theme['palette']}
 */
const palette = {
    mode: 'light',
    primary: {
        main: '#458cA5',
        secondary: '#337288',
        light: '#f6f9fa',
        contrastText: '#fff',
    },
    secondary: {
        main: '#f48022',
        contrastText: '#f0f0f0',
    },
    info: {
        main: '#f48022',
        contrastText: '#fff',
    },
    warning: {
        main: '#f48022',
        contrastText: '#fff',
    },
    error: {
        main: '#f44336',
        contrastText: '#fff',
    },
    success: {
        main: '#779e04',
        contrastText: '#f0f0f0',
    },
    text: {
        primary: '#1d1d1d',
        main: '#4a4a4a',
    },
    contrastThreshold: 3, // Mui default (we need to look if is pertinent to change it)
    // Do not exist in mui / Custom variable
    danger: {
        main: '#f44336',
        contrastText: '#fff',
    },
    neutral: {
        main: '#e0e0e0',
    },
    // Use mui palette.grey ???
    neutralDark: {
        main: '#555',
        secondary: '#4a4a4a',
        veryDark: '#000',
        dark: '#555',
        light: '#8f8f8f',
        lighter: '#f0f0f0',
        veryLight: '#f6f9fa',
        transparent: 'rgba(0, 0, 0, .1)',
    },
    contrast: {
        main: '#fff',
        light: '#f0f0f0',
    },
};

export default {
    palette,
};
