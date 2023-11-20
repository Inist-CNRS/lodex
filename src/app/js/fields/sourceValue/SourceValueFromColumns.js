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
    updateDefaultValueTransformers,
    value,
}) => {
    console.log('-------- SourceValueFromColumns ---------');
    console.log(value);
    const [autocompleteValue, setAutocompleteValue] = React.useState(value);
    useEffect(() => {
        setAutocompleteValue(value);
    }, [value]);

    const handleChange = (event, value) => {
        setAutocompleteValue(value);
        updateDefaultValueTransformers([
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
                data-testid="source-value-from-columns"
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
    datasetFields: fromParsing
        .getParsedExcerptColumns(state)
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())),
});

SourceValueFromColumns.propTypes = {
    datasetFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    p: polyglotPropTypes.isRequired,
    updateDefaultValueTransformers: PropTypes.func.isRequired,
    value: PropTypes.array,
};

export default compose(
    connect(mapStateToProps),
    translate,
)(SourceValueFromColumns);
