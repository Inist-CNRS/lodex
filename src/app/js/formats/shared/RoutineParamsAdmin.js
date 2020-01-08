import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

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
            maxSize: newMaxSize,
            maxValue,
            minValue,
            orderBy,
            uri,
        });
    };

    const setMaxValue = (_, newMaxValue) => {
        onChange({
            maxSize,
            maxValue: newMaxValue,
            minValue,
            orderBy,
            uri,
        });
    };

    const setMinValue = (_, newMinValue) => {
        onChange({
            maxSize,
            maxValue,
            minValue: newMinValue,
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
                <SelectField
                    floatingLabelText={polyglot.t('order_by')}
                    onChange={setOrderBy}
                    style={styles.input}
                    value={orderBy}
                >
                    <MenuItem
                        value="_id/asc"
                        primaryText={polyglot.t('label_asc')}
                    />
                    <MenuItem
                        value="_id/desc"
                        primaryText={polyglot.t('label_desc')}
                    />
                    <MenuItem
                        value="value/asc"
                        primaryText={polyglot.t('value_asc')}
                    />
                    <MenuItem
                        value="value/desc"
                        primaryText={polyglot.t('value_desc')}
                    />
                </SelectField>
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
