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
    // common: { // Mui default (we need to look if is pertinent to change it)
    //     black: '#000',
    //     white: '#fff',
    // },
    primary: {
        main: '#7dbd42',
        light: 'rgba(125, 189, 66, .7)',
        dark: 'rgba(125, 189, 66, .1)',
        contrastText: '#fff', // Mui default (we need to look if is pertinent to change it)
    },
    secondary: {
        main: '#f48022',
        // light: '#ba68c8', // Mui default (we need to look if is pertinent to change it)
        // dark: '#7b1fa2', // Mui default (we need to look if is pertinent to change it)
        contrastText: '#fff', // Mui default (we need to look if is pertinent to change it)
    },
    // error: { // Mui default (we need to look if is pertinent to change it)
    //     main: '#d32f2f',
    //     light: '#ef5350',
    //     dark: '#c62828',
    //     contrastText: '#fff',
    // },
    warning: {
        main: '#f48022',
        // light: '#ff9800', // Mui default (we need to look if is pertinent to change it)
        // dark: '#e65100', // Mui default (we need to look if is pertinent to change it)
        contrastText: '#fff', // Mui default (we need to look if is pertinent to change it)
    },
    info: {
        main: '#b22f90',
        // light: '#03a9f4', // Mui default (we need to look if is pertinent to change it)
        // dark: '#01579b', // Mui default (we need to look if is pertinent to change it)
        contrastText: '#fff', // Mui default (we need to look if is pertinent to change it)
    },
    success: {
        main: '#7dbd42',
        // light: '#4caf50', // Mui default (we need to look if is pertinent to change it)
        // dark: '#1b5e20', // Mui default (we need to look if is pertinent to change it)
        contrastText: '#fff', // Mui default (we need to look if is pertinent to change it)
    },
    text: {
        main: 'rgb(98, 99, 104)', // Do not exist in mui
        primary: 'rgb(98, 99, 104)', // I think is better to use mui color `rgba(0, 0, 0, 0.87)` ?
        secondary: 'rgba(0, 0, 0, 0.6)',
        disabled: 'rgba(0, 0, 0, 0.38)',
    },
    // background: { // Mui default (we need to look if is pertinent to change it)
    //     paper: '#fff',
    //     default: '#fff',
    // },
    // action: { // Mui default (we need to look if is pertinent to change it)
    //     active: 'rgba(0, 0, 0, 0.54)',
    //     hover: 'rgba(0, 0, 0, 0.04)',
    //     hoverOpacity: 0.04,
    //     selected: 'rgba(0, 0, 0, 0.08)',
    //     selectedOpacity: 0.08,
    //     disabled: 'rgba(0, 0, 0, 0.26)',
    //     disabledBackground: 'rgba(0, 0, 0, 0.12)',
    //     disabledOpacity: 0.38,
    //     focus: 'rgba(0, 0, 0, 0.12)',
    //     focusOpacity: 0.12,
    //     activatedOpacity: 0.12,
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
