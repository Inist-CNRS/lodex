/**
 * LODEX Nougat Theme
 * @licence CeCILL
 */

/**
 * LODEX use Mui theme
 * See this link to look a mui configuration
 * https://mui.com/material-ui/customization/theming/
 * https://mui.com/material-ui/customization/palette/
 * https://mui.com/material-ui/customization/default-theme/
 * https://zenoo.github.io/mui-theme-creator/
 * @type {Partial<import('@mui/material/styles').Theme['palette']>}
 */
const palette = {
    mode: 'light',
    primary: {
        main: '#542a12',
    },
    secondary: {
        main: '#db8757',
    },
    warning: {
        main: '#ff7043',
    },
    error: {
        main: '#dd2c00',
    },
    info: {
        main: '#8d6e63',
    },
    success: {
        main: '#90a4ae',
    },
    text: {
        primary: '#626368',
    },
    // Do not exist in mui / Custom variable
    danger: {
        main: '#d50000',
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
