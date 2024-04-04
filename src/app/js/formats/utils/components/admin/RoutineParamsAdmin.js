import React from 'react';
import PropTypes from 'prop-types';
import {
    TextField,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
    Box,
} from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../../../propTypes';

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
    const handleMaxSize = (e) => {
        onChange({
            maxSize: e.target.value,
            maxValue,
            minValue,
            orderBy,
            uri,
        });
    };

    const handleMaxValue = (e) => {
        onChange({
            maxSize,
            maxValue: e.target.value,
            minValue,
            orderBy,
            uri,
        });
    };

    const handleMinValue = (e) => {
        onChange({
            maxSize,
            maxValue,
            minValue: e.target.value,
            orderBy,
            uri,
        });
    };

    const handleSortField = (e) => {
        onChange({
            maxSize,
            maxValue,
            minValue,
            orderBy: `${e.target.value}/${orderBy?.split('/')[1]}`,
            uri,
        });
    };

    const handleSortOrder = (e) => {
        onChange({
            maxSize,
            maxValue,
            minValue,
            orderBy: `${orderBy?.split('/')[0]}/${e.target.value}`,
            uri,
        });
    };

    const handleUri = (e) => {
        onChange({
            maxSize,
            maxValue,
            minValue,
            orderBy,
            uri: e.target.value,
        });
    };

    return (
        <Box display="flex" flexDirection="column" gap={2} width="100%">
            {showMaxSize && (
                <TextField
                    label={polyglot.t('max_fields')}
                    onChange={handleMaxSize}
                    value={maxSize}
                    sx={{ width: '50%' }}
                />
            )}
            {(showMinValue || showMaxValue) && (
                <Box display="flex" gap={1}>
                    {showMinValue && (
                        <TextField
                            label={polyglot.t('min_value')}
                            onChange={handleMinValue}
                            value={minValue}
                            fullWidth
                        />
                    )}
                    {showMaxValue && (
                        <TextField
                            label={polyglot.t('max_value')}
                            onChange={handleMaxValue}
                            value={maxValue}
                            fullWidth
                        />
                    )}
                </Box>
            )}
            {showOrderBy && (
                <Box>
                    <Typography>{polyglot.t('order_by')}</Typography>
                    <FormControl sx={{ display: 'flex', flexDirection: 'row' }}>
                        <RadioGroup
                            value={orderBy?.split('/')[0]}
                            onChange={handleSortField}
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
                            onChange={handleSortOrder}
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
                </Box>
            )}
            {showUri && (
                <TextField
                    label={polyglot.t('uri')}
                    onChange={handleUri}
                    value={uri}
                    sx={{ width: '50%' }}
                />
            )}
        </Box>
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
