import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Autocomplete, TextField } from '@mui/material';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { change, formValueSelector } from 'redux-form';

import { FIELD_FORM_NAME } from './';

import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../propTypes';

const FieldComposedOf = ({ onChange, fields, p: polyglot, columns }) => {
    const autocompleteOptions = fields.map(field => field.name);

    const handleChange = (event, value) => {
        onChange({
            isComposedOf: value.length > 0,
            fields: value,
        });
    };

    return (
        <Box mt={5}>
            <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                {polyglot.t('wizard_composed_of')}
            </Typography>
            <Autocomplete
                multiple
                fullWidth
                options={autocompleteOptions}
                getOptionLabel={option =>
                    fields.find(field => field.name === option)?.label ?? option
                }
                value={columns ?? []}
                renderInput={params => (
                    <TextField
                        {...params}
                        label={polyglot.t('fields_composed_of')}
                    />
                )}
                onChange={handleChange}
            />
        </Box>
    );
};

FieldComposedOf.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string),
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

FieldComposedOf.defaultProps = {
    columns: [],
};

const mapStateToProps = (state, { FORM_NAME }) => {
    const composedOf = formValueSelector(FORM_NAME || FIELD_FORM_NAME)(
        state,
        'composedOf',
    );

    if (composedOf && composedOf.fields && composedOf.fields.length > 0) {
        return {
            columns: composedOf.fields,
        };
    }
    return { columns: [] };
};

const mapDispatchToProps = (dispatch, { FORM_NAME = FIELD_FORM_NAME }) => ({
    onChange: composedOf => {
        dispatch(change(FORM_NAME, 'composedOf', composedOf));
    },
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(FieldComposedOf);
