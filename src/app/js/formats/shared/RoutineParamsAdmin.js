import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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
    const setMaxSize = (_, newMaxSize) => {
        onChange({
            maxSize: parseInt(newMaxSize, 10),
            maxValue,
            minValue,
            orderBy,
            uri,
        });
    };

    const setMaxValue = (_, newMaxValue) => {
        onChange({
            maxSize,
            maxValue: parseInt(newMaxValue, 10),
            minValue,
            orderBy,
            uri,
        });
    };

    const setMinValue = (_, newMinValue) => {
        onChange({
            maxSize,
            maxValue,
            minValue: parseInt(newMinValue, 10),
            orderBy,
            uri,
        });
    };

    const setOrderBy = (_, __, newOrderBy) => {
        onChange({
            maxSize,
            maxValue,
            minValue,
            orderBy: newOrderBy,
            uri,
        });
    };

    const setUri = (_, newUri) => {
        onChange({
            maxSize,
            maxValue,
            minValue,
            orderBy,
            uri: newUri,
        });
    };

    return (
        <>
            {showMaxSize && (
                <TextField
                    floatingLabelText={polyglot.t('max_fields')}
                    onChange={setMaxSize}
                    style={styles.input}
                    value={maxSize}
                />
            )}
            {showMinValue && (
                <TextField
                    floatingLabelText={polyglot.t('min_value')}
                    onChange={setMinValue}
                    style={styles.input}
                    value={minValue}
                />
            )}
            {showMaxValue && (
                <TextField
                    floatingLabelText={polyglot.t('max_value')}
                    onChange={setMaxValue}
                    style={styles.input}
                    value={maxValue}
                />
            )}
            {showOrderBy && (
                <Select
                    name={polyglot.t('order_by')}
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
            )}
            {showUri && (
                <TextField
                    floatingLabelText={polyglot.t('uri')}
                    onChange={setUri}
                    style={styles.input}
                    value={uri}
                />
            )}
        </>
    );
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
