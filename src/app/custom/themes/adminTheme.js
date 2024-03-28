import colorsTheme from './default/colorsTheme';

export default {
    palette: {
        primary: {
            main: colorsTheme.green.primary,
            secondary: colorsTheme.green.secondary,
            light: colorsTheme.green.light,
            contrastText: colorsTheme.white.primary,
        },
        secondary: {
            main: colorsTheme.orange.primary,
            contrastText: colorsTheme.white.primary,
        },
        info: {
            main: colorsTheme.purple.primary,
            contrastText: colorsTheme.white.primary,
        },
        warning: {
            main: colorsTheme.orange.primary,
            contrastText: colorsTheme.white.primary,
        },
        danger: {
            main: colorsTheme.red.primary,
            contrastText: colorsTheme.white.primary,
        },
        success: {
            main: colorsTheme.green.primary,
            contrastText: colorsTheme.white.primary,
        },
        neutral: {
            main: colorsTheme.gray.primary,
        },
        neutralDark: {
            main: colorsTheme.black.dark,
            secondary: colorsTheme.black.secondary,
            veryDark: colorsTheme.black.veryDark,
            dark: colorsTheme.black.dark,
            light: colorsTheme.black.light,
            lighter: colorsTheme.black.lighter,
            veryLight: colorsTheme.black.veryLight,
            transparent: colorsTheme.black.transparent,
        },
        text: {
            primary: colorsTheme.black.secondary,
            main: colorsTheme.black.secondary,
        },
        contrast: {
            main: colorsTheme.white.primary,
            light: colorsTheme.white.light,
        },
        contrastThreshold: 3,
    },
};
