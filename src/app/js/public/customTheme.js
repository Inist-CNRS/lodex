import theme from '../theme';

export default {
    palette: {
        common: {
            black: theme.black.primary,
            white: theme.white.primary,
        },
        background: {
            paper: theme.white.primary,
            default: '#fafafa',
        },
        primary: {
            main: theme.green.primary,
            contrastText: theme.white.primary,
        },
        secondary: {
            main: theme.purple.primary,
            contrastText: theme.white.primary,
        },
        error: {
            main: theme.red.primary,
            contrastText: theme.white.primary,
        },
    },
    typography: {
        useNextVariants: true,
        fontFamily: 'Quicksand, sans-serif',
        fontSize: 12,
    },
};
