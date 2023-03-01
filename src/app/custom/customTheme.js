import colorsTheme from './colorsTheme';

export default {
    palette: {
        primary: {
            main: colorsTheme.green.primary,
            contrastText: colorsTheme.white.primary,
        },
        contrastThreshold: 3,
        secondary: {
            main: colorsTheme.orange.primary,
        },
        //TODO : find this usage or remove
        primary2Color: colorsTheme.purple.primary,
        text: {
            primary: colorsTheme.black.secondary,
            main: colorsTheme.black.secondary,
        },
    },
    typography: {
        fontFamily: 'Quicksand, sans-serif',
    },
};
