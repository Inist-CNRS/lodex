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
        main: '#c94d62',
        secondary: '#e58985',
        light: 'rgba(253, 242, 237, 1)',
        contrastText: '#fff',
    },
    secondary: {
        main: '#8f152a',
        contrastText: '#fff',
    },
    info: {
        main: '#c94d62',
        contrastText: '#fff',
    },
    warning: {
        main: '#f92f51',
        contrastText: '#fff',
    },
    error: {
        main: '#f92f51',
        contrastText: '#fff',
    },
    success: {
        main: '#7ab937',
        contrastText: '#fff',
    },
    text: {
        primary: '#000',
        main: 'rgb(95, 99, 104)', // Do not exist in mui
    },
    contrastThreshold: 3, // Mui default (we need to look if is pertinent to change it)
    // Do not exist in mui / Custom variable
    danger: {
        main: '#f92f51',
        contrastText: '#fff',
    },
    neutral: {
        main: 'rgba(245, 245, 245, 1)',
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
        light: '#e2e2e2',
    },
};

export default {
    palette,
};
