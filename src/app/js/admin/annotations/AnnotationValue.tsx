import { Grid, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useTranslate } from '../../i18n/I18NContext';
import PropTypes from 'prop-types';

// @ts-expect-error TS7031
export const AnnotationValue = ({ value, label }) => {
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

AnnotationValue.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.node,
};
