/**
 * LODEX System Theme
 * @licence CeCILL
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
    background: {
        default: '#fafafa',
        paper: '#fafafa',
    },
    primary: {
        main: '#7dbd42',
        secondary: 'rgba(125, 189, 66, .7)', // Do not exist in mui
        // light: 'rgba(125, 189, 66, .7)',  // Old color, now using mui to generated new color
        // dark: 'rgba(125, 189, 66, .1)',   // The new color may be different
        contrastText: '#fff',
    },
    secondary: {
        main: '#f48022',
        contrastText: '#fff',
    },
    info: {
        main: '#b22f90',
    },
    warning: {
        main: '#f48022',
        contrastText: '#fff',
    },
    error: {
        main: '#f44336',
    },
    success: {
        main: '#7dbd42',
        contrastText: '#fff',
    },
    // text: {
    //     main: 'rgb(98,99,104)', // Do not exist in mui
    //     primary: 'rgb(98,99,104)',
    //     secondary: 'rgba(98,99,104,0.75)',
    //     disabled: 'rgba(98,99,104,0.55)',
    // },
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
        secondary: 'rgb(98, 99, 104)',
        veryDark: '#333',
        dark: '#555',
        light: 'rgb(98, 99, 104, 0.5)',
        lighter: 'rgb(98, 99, 104, 0.15)',
        veryLight: 'rgb(98, 99, 104, 0.1)',
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
