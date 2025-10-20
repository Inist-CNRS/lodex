import { Grid, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useTranslate } from '../../i18n/I18NContext';

interface AnnotationValueProps {
    label: string;
    value?: React.ReactNode;
}

export const AnnotationValue = ({
    value,
    label
}: AnnotationValueProps) => {
    const { translate } = useTranslate();
    const theme = useTheme();

    return (
        <>
            <Grid item xs={1}>
                <Typography
                    id={label}
                    sx={{
                        fontWeight: 800,
                        color: theme.palette.text.secondary,
                    }}
                >
                    {translate(label)}
                </Typography>
            </Grid>
            <Grid item xs={1}>
                <Typography variant="body1" aria-labelledby={label}>
                    {value}
                </Typography>
            </Grid>
        </>
    );
};
