import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { Autocomplete, Box, TextField } from '@mui/material';
import { connect } from 'react-redux';
import { fromParsing } from '../../admin/selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const SourceValueFromColumns = ({
    datasetFields,
    p: polyglot,
    updateTransformers,
    value,
}) => {
    const [autocompleteValue, setAutocompleteValue] = React.useState(value);
    useEffect(() => {
        setAutocompleteValue(value);
    }, [value]);

    const handleChange = (event, value) => {
        setAutocompleteValue(value);
        updateTransformers([
            {
                operation: value.length > 1 ? 'CONCAT' : 'COLUMN',
                args:
                    value.length !== 0
                        ? value.map(v => ({
                              name: 'column',
                              type: 'column',
                              value: v,
                          }))
                        : [{ name: 'column', type: 'column' }],
            },
        ]);
    };

    return (
        <Box mt={5} display="flex">
            <Autocomplete
                multiple
                fullWidth
                options={datasetFields}
                value={autocompleteValue ?? []}
                renderInput={params => (
                    <TextField
                        {...params}
                        label={polyglot.t('from_columns')}
                        placeholder={polyglot.t('enter_from_columns')}
                    />
                )}
                onChange={handleChange}
            />
        </Box>
    );
};

const mapStateToProps = state => ({
    datasetFields: fromParsing.getParsedExcerptColumns(state),
});

SourceValueFromColumns.propTypes = {
    datasetFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    p: polyglotPropTypes.isRequired,
    updateTransformers: PropTypes.func.isRequired,
    value: PropTypes.array,
};

export default compose(
    connect(mapStateToProps),
    translate,
)(SourceValueFromColumns);
