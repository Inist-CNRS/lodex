import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { Autocomplete, Box, TextField } from '@mui/material';
import { connect } from 'react-redux';
import { fromParsing } from '../../admin/selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import parseValue from '../../../../common/tools/parseValue';

const SourceValueFromColumnsForSubResource = ({
    datasetFields,
    p: polyglot,
    updateDefaultValueTransformers,
    value,
    subresourcePath,
}) => {
    const [autocompleteValue, setAutocompleteValue] = React.useState(value);

    useEffect(() => {
        setAutocompleteValue(value);
    }, [value]);

    const handleChange = (event, value) => {
        setAutocompleteValue(value);
        updateDefaultValueTransformers([
            {
                operation: 'COLUMN',
                args: [
                    {
                        name: 'column',
                        type: 'column',
                        value: subresourcePath,
                    },
                ],
            },
            {
                operation: 'PARSE',
            },
            {
                operation: 'GET',
                args: [
                    {
                        name: 'path',
                        type: 'string',
                        value,
                    },
                ],
            },
        ]);
    };

    return (
        <Box mt={5} display="flex">
            <Autocomplete
                data-testid="source-value-from-columns"
                fullWidth
                options={datasetFields}
                value={autocompleteValue ?? []}
                renderInput={(params) => (
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

export const mapStateToProps = (state, { selectedSubresourceUri }) => {
    const { subresources } = state.subresource;

    const subresource = subresources.find(
        (s) => s._id === selectedSubresourceUri,
    );
    const [firstParsedLine] = fromParsing.getExcerptLines(state);

    if (!subresource || !firstParsedLine) {
        return {};
    }

    const subresourceData = parseValue(firstParsedLine[subresource.path] || '');

    return {
        datasetFields: [
            ...Object.keys(
                (Array.isArray(subresourceData)
                    ? subresourceData[0]
                    : subresourceData) || {},
            ),
            ...[state.polyglot.phrases['other']],
        ].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())),
        subresourcePath: subresource.path,
    };
};

SourceValueFromColumnsForSubResource.propTypes = {
    datasetFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    p: polyglotPropTypes.isRequired,
    updateDefaultValueTransformers: PropTypes.func.isRequired,
    value: PropTypes.array,
    subresourcePath: PropTypes.string,
};

export default compose(
    connect(mapStateToProps),
    translate,
)(SourceValueFromColumnsForSubResource);
