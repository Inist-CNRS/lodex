/**
 * LODEX INIST Theme
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
        main: '#00284b',
        secondary: '#9ae2ff',
        light: '#ffeb6e',
        contrastText: '#fff',
    },
    secondary: {
        main: '#6941eb',
        contrastText: '#fff',
    },
    info: {
        main: '#6941eb',
        contrastText: '#fff',
    },
    warning: {
        main: '#ffbc75',
        contrastText: '#fff',
    },
    error: {
        main: '#f44336',
        contrastText: '#fff',
    },
    success: {
        main: '#00284b',
        contrastText: '#fff',
    },
    text: {
        primary: '#00284b',
        main: 'rgb(95, 99, 104)', // Do not exist in mui
    },
    contrastThreshold: 3, // Mui default (we need to look if is pertinent to change it)
    // Do not exist in mui / Custom variable
    danger: {
        main: '#f44336',
        contrastText: '#fff',
    },
    neutral: {
        main: '#ebf0f5',
    },
    // Use mui palette.grey ???
    neutralDark: {
        main: '#555',
        secondary: 'rgb(95, 99, 104)',
        veryDark: '#333',
        dark: '#555',
        light: 'rgb(95, 99, 104, 0.5)',
        lighter: 'rgb(95, 99, 104, 0.15)',
        veryLight: 'rgb(95, 99, 104, 0.1)',
        transparent: 'rgba(0, 0, 0, .1)',
    },
    contrast: {
        main: '#fff',
        light: 'rgba(255, 255, 255, .2)',
    },
};

export default {
    palette,
};
