import React from 'react';
import useTheme from './hook/useTheme';
import {
    createTheme as createThemeMui,
    ThemeProvider,
} from '@mui/material/styles';

type LodexThemeProviderProps = {
    children: React.ReactNode;
};

const LodexThemeProvider = ({ children }: LodexThemeProviderProps) => {
    const theme = useTheme();

    return (
        <ThemeProvider theme={createThemeMui(theme)}>{children}</ThemeProvider>
    );
};

export default LodexThemeProvider;
