import theme from '../theme';

export default {
    palette: {
        primary: {
            main: theme.green.primary,
            contrastText: '#ffffff',
        },
        contrastThreshold: 3,
        secondary: {
            main: theme.orange.primary,
        },
        primary2Color: theme.purple.primary,
        text: {
            primary: '#5F6368',
        },
    },
    typography: {
        fontFamily: 'Quicksand, sans-serif',
    },
};
