import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { Autocomplete, Box, TextField } from '@mui/material';
import { connect } from 'react-redux';
import { fromParsing } from '../../admin/selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import parseValue from '../../../../common/tools/parseValue';
import { translate } from '../../i18n/I18NContext';
import { fromI18n } from '../../public/selectors';

const SourceValueFromColumnsForSubResource = ({
    // @ts-expect-error TS7031
    datasetFields,
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    updateDefaultValueTransformers,
    // @ts-expect-error TS7031
    value,
    // @ts-expect-error TS7031
    subresourcePath,
}) => {
    const [autocompleteValue, setAutocompleteValue] = React.useState(value);

    useEffect(() => {
        setAutocompleteValue(value);
    }, [value]);

    // @ts-expect-error TS7006
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

// @ts-expect-error TS7006
export const mapStateToProps = (state, { selectedSubresourceUri }) => {
    const { subresources } = state.subresource;

    const subresource = subresources.find(
        // @ts-expect-error TS7006
        (s) => s._id === selectedSubresourceUri,
    );
    // @ts-expect-error TS2339
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
            // @ts-expect-error TS2339
            ...[fromI18n.getPhrases(state)['other']],
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
    // @ts-expect-error TS2345
)(SourceValueFromColumnsForSubResource);
