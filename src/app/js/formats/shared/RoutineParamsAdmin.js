import React from 'react';
import PropTypes from 'prop-types';
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    input: {
        width: '100%',
    },
};

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

    const setOrderBy = e => {
        onChange({
            maxSize,
            maxValue,
            minValue,
            orderBy: e.target.value,
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
        <>
            {showMaxSize && (
                <TextField
                    label={polyglot.t('max_fields')}
                    onChange={setMaxSize}
                    style={styles.input}
                    value={maxSize}
                />
            )}
            {showMinValue && (
                <TextField
                    label={polyglot.t('min_value')}
                    onChange={setMinValue}
                    style={styles.input}
                    value={minValue}
                />
            )}
            {showMaxValue && (
                <TextField
                    label={polyglot.t('max_value')}
                    onChange={setMaxValue}
                    style={styles.input}
                    value={maxValue}
                />
            )}
            {showOrderBy && (
                <FormControl fullWidth>
                    <InputLabel id="routine-params-admin-input-label">
                        {polyglot.t('order_by')}
                    </InputLabel>
                    <Select
                        labelId="routine-params-admin-input-label"
                        onChange={setOrderBy}
                        style={styles.input}
                        value={orderBy}
                    >
                        <MenuItem value="_id/asc">
                            {polyglot.t('label_asc')}
                        </MenuItem>
                        <MenuItem value="_id/desc">
                            {polyglot.t('label_desc')}
                        </MenuItem>
                        <MenuItem value="value/asc">
                            {polyglot.t('value_asc')}
                        </MenuItem>
                        <MenuItem value="value/desc">
                            {polyglot.t('value_desc')}
                        </MenuItem>
                    </Select>
                </FormControl>
            )}
            {showUri && (
                <TextField
                    label={polyglot.t('uri')}
                    onChange={setUri}
                    style={styles.input}
                    value={uri}
                />
            )}
        </>
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
