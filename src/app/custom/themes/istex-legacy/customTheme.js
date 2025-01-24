import colorsTheme from './colorsTheme';

export default {
    palette: {
        primary: {
            main: colorsTheme.blue.primary,
            secondary: colorsTheme.blue.secondary,
            light: colorsTheme.blue.light,
            contrastText: colorsTheme.white.primary,
        },
        secondary: {
            main: colorsTheme.orange.primary,
            contrastText: colorsTheme.white.light,
        },
        info: {
            main: colorsTheme.orange.primary,
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
            main: colorsTheme.green.secondary,
            contrastText: colorsTheme.white.light,
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
            primary: colorsTheme.black.primary,
            main: colorsTheme.black.secondary,
        },
        contrast: {
            main: colorsTheme.white.primary,
            light: colorsTheme.white.light,
        },
        contrastThreshold: 3,
    },
};
