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
        main: '#8f152a',
        secondary: '#e58985',
        contrastText: '#fff',
        light: 'rgba(253, 242, 237, 1)',
    },
    secondary: {
        main: '#c94d62',
        contrastText: '#fff',
    },
    info: {
        main: 'rgb(165, 67, 84)', //utilisé pour hover des liens
    },
    text: {
        primary: '#000',
    },
    contrastThreshold: 4, // Mui default (we need to look if is pertinent to change it)
};

export default {
    palette,
};
