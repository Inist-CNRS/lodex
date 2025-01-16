import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import {
    Autocomplete,
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import { connect } from 'react-redux';
import { fromParsing } from '../../admin/selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import parseValue from '../../../../common/tools/parseValue';

export const GET_TRANSFORMERS_FROM_SUBRESOURCE = (
    subresources,
    subresourcePath,
    column,
) => {
    if (!subresources || !subresourcePath) return [];

    const subresource = subresources.find((sr) => sr.path === subresourcePath);

    if (!subresource) return [];

    const transformers = [
        {
            operation: 'COLUMN',
            args: [{ name: 'column', type: 'column', value: subresource.path }],
        },
        { operation: 'PARSE' },
        {
            operation: 'GET',
            args: [
                {
                    name: 'path',
                    type: 'string',
                    value: column || subresource.identifier,
                },
            ],
        },
        { operation: 'STRING' },
    ];

    if (!column) {
        transformers.push(
            {
                operation: 'REPLACE_REGEX',
                args: [
                    { name: 'searchValue', type: 'string', value: '^(.*)$' },
                    {
                        name: 'replaceValue',
                        type: 'string',
                        value: `${subresource._id}/$1`,
                    },
                ],
            },
            { operation: 'MD5', args: [] },
            {
                operation: 'REPLACE_REGEX',
                args: [
                    { name: 'searchValue', type: 'string', value: '^(.*)$' },
                    { name: 'replaceValue', type: 'string', value: `uid:/$1` },
                ],
            },
        );
    } else {
        transformers.push(
            {
                operation: 'REPLACE_REGEX',
                args: [
                    { name: 'searchValue', type: 'string', value: '^(.*)$' },
                    {
                        name: 'replaceValue',
                        type: 'string',
                        value: `(${subresource._id})$1`,
                    },
                ],
            },
            {
                operation: 'REPLACE_REGEX',
                args: [
                    {
                        name: 'searchValue',
                        type: 'string',
                        value: `/^\\((.*)\\)/`,
                    },
                    { name: 'replaceValue', type: 'string', value: ' ' },
                ],
            },
            { operation: 'TRIM' },
        );
    }

    return transformers;
};

const SourceValueFromSubResource = ({
    firstParsedLine,
    p: polyglot,
    subresources,
    path,
    column,
    updateDefaultValueTransformers,
}) => {
    const [autocompleteValue, setAutocompleteValue] = React.useState(column);
    const [datasetFields, setDatasetFields] = React.useState([]);
    useEffect(() => {
        const subresourceData = parseValue(firstParsedLine[path] || '');

        const datasetFields = [
            ...Object.keys(
                (Array.isArray(subresourceData)
                    ? subresourceData[0]
                    : subresourceData) || {},
            ),
        ].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        setDatasetFields(datasetFields);
    }, [path]);

    useEffect(() => {
        setAutocompleteValue(column);
    }, [column]);

    const handleChangeSubresource = (event) => {
        const transformers = GET_TRANSFORMERS_FROM_SUBRESOURCE(
            subresources,
            event.target.value,
            null,
        );
        updateDefaultValueTransformers(transformers);
    };

    const handleChange = (event, value) => {
        const transformers = GET_TRANSFORMERS_FROM_SUBRESOURCE(
            subresources,
            path,
            value,
        );
        updateDefaultValueTransformers(transformers);
    };

    return (
        <Box mt={5} display="flex" flexDirection="column" gap={2}>
            <FormControl fullWidth>
                <InputLabel id="select-subresource-label">
                    {polyglot.t('subRessource_tooltip')}
                </InputLabel>
                <Select
                    labelId="select-subresource-label"
                    data-testid="select-subresource"
                    value={path}
                    label={polyglot.t('subRessource_tooltip')}
                    onChange={handleChangeSubresource}
                >
                    {subresources.map((subresource) => (
                        // TODO: manage selected subresource with its id because two subresources can have the same path
                        // but currently we store only the path in mongo and not the id
                        <MenuItem
                            key={subresource.path}
                            value={subresource.path}
                        >
                            {subresource.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Autocomplete
                labelId="autocomplete-subresource-label"
                data-testid="autocomplete-subresource-label"
                fullWidth
                options={datasetFields}
                value={autocompleteValue ?? ''}
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

export const mapStateToProps = (state) => {
    const { subresources } = state.subresource;
    const [firstParsedLine] = fromParsing.getExcerptLines(state);

    return { subresources, firstParsedLine };
};

SourceValueFromSubResource.propTypes = {
    firstParsedLine: PropTypes.object,
    p: polyglotPropTypes.isRequired,
    subresources: PropTypes.array,
    updateDefaultValueTransformers: PropTypes.func.isRequired,
    column: PropTypes.string,
    path: PropTypes.string,
};

export default compose(
    connect(mapStateToProps),
    translate,
)(SourceValueFromSubResource);
