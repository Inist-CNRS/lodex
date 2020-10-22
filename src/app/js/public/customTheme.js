import theme from '../theme';

export default {
    palette: {
        primary: {
            main: theme.green.primary,
            contrastText: theme.white.primary,
        },
        contrastThreshold: 3,
        secondary: {
            main: theme.orange.primary,
        },
        //TODO : find this usage or remove
        primary2Color: theme.purple.primary,
        text: {
            primary: theme.black.secondary,
        },
    },
    typography: {
        fontFamily: 'Quicksand, sans-serif',
    },
};
