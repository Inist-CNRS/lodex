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

/*canard: {
    primary: '#458CA5', //canard 0
    dark: '#31768f', //canard -1
    darker: '#1a5a71', //canard -2
    light: '#69A1B6', //canard 1
    lighter: '#8FBAC9', //canard 2
    background: '#F6F9FA', //canard 3
},
lime: {
    primary: '#C4D733', //lime 0
    light: '#E3EF63', //lime 1
    lighter: '#F9FBEB', //lime 2
    dark: '#A9BB1E', //lime -1
},
gris: {
    black: '#000000',
    dark: '#1D1D1D', //gris 0
    main: '#FAFAFA', //gris 1
    light: '#8F8F8F', //gris 2
    lighter: '#F0F0F0', //gris 3
    white: '#FFFFFF',
},*/
const palette = {
    mode: 'light',
    primary: {
        main: '#458cA5',
        secondary: '#31768F',
        light: '#69A1B6',
        lighter: '#8FBAC9',
        veryLight: '#f6f9fa',
        contrastText: '#fff',
    },
    secondary: {
        main: '#A9BB1E',
        light: '#E3EF63',
        lighter: '#F9FBEB',
        contrastText: '#fff',
    },
    info: {
        main: '#C4D733',
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
        main: '#A9BB1E',
        contrastText: '#fff',
    },
    text: {
        primary: '#1d1d1d',
        main: '#4a4a4a',
    },
    // Do not exist in mui / Custom variable
    danger: {
        main: '#f44336',
        contrastText: '#fff',
    },
    contrastThreshold: 4.1, // Mui default 3
    // Use mui palette.grey ???
    neutralDark: {
        main: '#8f8f8f',
        secondary: '#4a4a4a',
        dark: '#1D1D1D',
        light: '#f0f0f0',
        lighter: '#f6f9fa',
        transparent: 'rgba(0, 0, 0, 0.01)',
    },
    contrast: {
        main: '#fff',
        light: '#f0f0f0',
    },
    link: {
        secondary: '#31768f',
        dark: '#1a5a71',
    },
};

export default {
    palette,
};
