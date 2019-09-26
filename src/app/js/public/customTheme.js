import theme from '../theme';

export default {
    palette: {
        common: {
            black: theme.black,
            white: theme.white,
        },
        background: {
            paper: theme.white,
            default: '#fafafa',
        },
        primary: {
            main: theme.green.primary,
            contrastText: theme.white,
        },
        secondary: {
            main: theme.purple.primary,
            contrastText: theme.white,
        },
        error: {
            main: theme.red.primary,
            contrastText: theme.white,
        },
    },
    typography: {
        useNextVariants: true,
        fontFamily: 'Quicksand, sans-serif',
        fontSize: 12,
    },
};
