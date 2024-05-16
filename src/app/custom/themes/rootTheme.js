/**
 * LODEX Root panel color palette
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
        main: '#539ce1',
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
        main: '#539ce1',
        contrastText: '#fff',
    },
    text: {
        primary: '#626368',
    },
};

export default {
    palette,
};
