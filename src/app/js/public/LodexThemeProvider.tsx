import useTheme from './hook/useTheme';
import {
    createTheme as createThemeMui,
    ThemeProvider,
} from '@mui/material/styles';
import PropTypes from 'prop-types';
import React from 'react';

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
