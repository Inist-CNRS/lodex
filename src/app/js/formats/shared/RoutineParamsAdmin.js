import React from 'react';
import PropTypes from 'prop-types';
import {
    TextField,
    Grid,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
} from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const RoutineParamsAdmin = ({
    polyglot,
    onChange,
    params: { maxSize, maxValue, minValue, orderBy, uri },
    showUri,
    showMaxSize,
    showMaxValue,
    showMinValue,
    showOrderBy,
}) => {
    const setMaxSize = e => {
        onChange({
            maxSize: e.target.value,
            maxValue,
            minValue,
            orderBy,
            uri,
        });
    };

    const setMaxValue = e => {
        onChange({
            maxSize,
            maxValue: e.target.value,
            minValue,
            orderBy,
            uri,
        });
    };

    const setMinValue = e => {
        onChange({
            maxSize,
            maxValue,
            minValue: e.target.value,
            orderBy,
            uri,
        });
    };

    const setSortField = e => {
        onChange({
            maxSize,
            maxValue,
            minValue,
            orderBy: `${e.target.value}/${orderBy?.split('/')[1]}`,
            uri,
        });
    };

    const setSortOrder = e => {
        onChange({
            maxSize,
            maxValue,
            minValue,
            orderBy: `${orderBy?.split('/')[0]}/${e.target.value}`,
            uri,
        });
    };

    const setUri = e => {
        onChange({
            maxSize,
            maxValue,
            minValue,
            orderBy,
            uri: e.target.value,
        });
    };

    return (
        <Grid container spacing={2}>
            {showMaxSize && (
                <Grid item xs={6}>
                    <TextField
                        label={polyglot.t('max_fields')}
                        onChange={setMaxSize}
                        value={maxSize}
                        fullWidth
                    />
                </Grid>
            )}
            {(showMinValue || showMaxValue) && (
                <Grid container item spacing={1}>
                    {showMinValue && (
                        <Grid item xs={6}>
                            <TextField
                                label={polyglot.t('min_value')}
                                onChange={setMinValue}
                                value={minValue}
                                fullWidth
                            />
                        </Grid>
                    )}
                    {showMaxValue && (
                        <Grid item xs={6}>
                            <TextField
                                label={polyglot.t('max_value')}
                                onChange={setMaxValue}
                                value={maxValue}
                                fullWidth
                            />
                        </Grid>
                    )}
                </Grid>
            )}
            {showOrderBy && (
                <Grid item xs={12}>
                    <Typography>{polyglot.t('order_by')}</Typography>
                    <FormControl sx={{ display: 'flex', flexDirection: 'row' }}>
                        <RadioGroup
                            value={orderBy?.split('/')[0]}
                            onChange={setSortField}
                            name="sort-field"
                        >
                            <FormControlLabel
                                value="_id"
                                control={<Radio />}
                                label={polyglot.t('label')}
                            />
                            <FormControlLabel
                                value="value"
                                control={<Radio />}
                                label={polyglot.t('value')}
                            />
                        </RadioGroup>
                        <RadioGroup
                            value={orderBy?.split('/')[1]}
                            onChange={setSortOrder}
                            name="sort-order"
                        >
                            <FormControlLabel
                                value="asc"
                                control={<Radio />}
                                label={polyglot.t('asc')}
                            />
                            <FormControlLabel
                                value="desc"
                                control={<Radio />}
                                label={polyglot.t('desc')}
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            )}
            {showUri && (
                <Grid item xs={6}>
                    <TextField
                        label={polyglot.t('uri')}
                        onChange={setUri}
                        value={uri}
                        fullWidth
                    />
                </Grid>
            )}
        </Grid>
    );
};

RoutineParamsAdmin.defaultProps = {
    showUri: false,
};

RoutineParamsAdmin.propTypes = {
    params: PropTypes.shape({
        maxSize: PropTypes.number,
        maxValue: PropTypes.number,
        minValue: PropTypes.number,
        orderBy: PropTypes.string,
        uri: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    polyglot: polyglotPropTypes.isRequired,
    showMaxSize: PropTypes.bool.isRequired,
    showMaxValue: PropTypes.bool.isRequired,
    showMinValue: PropTypes.bool.isRequired,
    showOrderBy: PropTypes.bool.isRequired,
    showUri: PropTypes.bool.isRequired,
};

export default RoutineParamsAdmin;
