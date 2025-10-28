import Grid from '@mui/material/Grid';
import useTheme from '@mui/material/styles/useTheme';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslate } from '../../../../../src/app/js/i18n/I18NContext';

export const ANNOTATION_GRID_COLUMNS = 4;

interface AnnotationValueProps {
    label: string;
    value?: React.ReactNode;
}

export const AnnotationValue = ({ value, label }: AnnotationValueProps) => {
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
            <Grid item xs={ANNOTATION_GRID_COLUMNS - 1}>
                <Typography variant="body1" aria-labelledby={label}>
                    {value}
                </Typography>
            </Grid>
        </>
    );
};
