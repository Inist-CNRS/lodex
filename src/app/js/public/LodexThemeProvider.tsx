import React from 'react';
import useTheme from './hook/useTheme';
import {
    createTheme as createThemeMui,
    ThemeProvider,
} from '@mui/material/styles';
import PropTypes from 'prop-types';

// @ts-expect-error TS7031
const LodexThemeProvider = ({ children }) => {
    const theme = useTheme();

    return (
        <ThemeProvider theme={createThemeMui(theme)}>{children}</ThemeProvider>
    );
};

LodexThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default LodexThemeProvider;
