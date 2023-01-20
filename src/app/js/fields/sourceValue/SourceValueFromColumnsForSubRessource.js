import React from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { Autocomplete, Box, TextField } from '@mui/material';
import { connect } from 'react-redux';
import { fromParsing } from '../../admin/selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import parseValue from '../../../../common/tools/parseValue';

const SourceValueFromColumnsForSubRessource = ({
    datasetFields,
    p: polyglot,
    updateTransformers,
    value,
    subresourcePath,
}) => {
    const handleChange = (event, value) => {
        updateTransformers([
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
                fullWidth
                options={datasetFields}
                defaultValue={value || []}
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

export const mapStateToProps = (state, { subresourceUri }) => {
    const { subresources } = state.subresource;

    const subresource = subresources.find(s => s._id === subresourceUri);
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
        ],
        subresourcePath: subresource.path,
    };
};

SourceValueFromColumnsForSubRessource.propTypes = {
    datasetFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    p: polyglotPropTypes.isRequired,
    updateTransformers: PropTypes.func.isRequired,
    value: PropTypes.array,
    subresourcePath: PropTypes.string,
};

export default compose(
    connect(mapStateToProps),
    translate,
)(SourceValueFromColumnsForSubRessource);
