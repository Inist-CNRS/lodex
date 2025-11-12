import React, { useEffect } from 'react';
import {
    Autocomplete,
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { fromParsing } from '../../selectors.ts';
import { parseValue } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import type { TransformerDraft } from '@lodex/frontend-common/fields/types.ts';

export const GET_TRANSFORMERS_FROM_SUBRESOURCE = (
    // @ts-expect-error TS7006
    subresources,
    // @ts-expect-error TS7006
    subresourcePath,
    // @ts-expect-error TS7006
    column,
) => {
    if (!subresources || !subresourcePath) return [];

    // @ts-expect-error TS7006
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
    path,
    column,
    updateDefaultValueTransformers,
}: {
    updateDefaultValueTransformers: (transformers: TransformerDraft[]) => void;
    path?: string;
    column?: string | null;
}) => {
    const { translate } = useTranslate();
    const { firstParsedLine, subresources } = useSelector((state: any) => {
        const { subresources } = state.subresource;
        const [firstParsedLine] = fromParsing.getExcerptLines(state);

        return { subresources, firstParsedLine };
    });
    const [autocompleteValue, setAutocompleteValue] = React.useState(column);
    const [datasetFields, setDatasetFields] = React.useState([]);
    useEffect(() => {
        const subresourceData = parseValue(firstParsedLine[path ?? ''] || '');

        const datasetFields = [
            ...Object.keys(
                (Array.isArray(subresourceData)
                    ? subresourceData[0]
                    : subresourceData) || {},
            ),
        ].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        // @ts-expect-error TS2345
        setDatasetFields(datasetFields);
    }, [path]);

    useEffect(() => {
        setAutocompleteValue(column);
    }, [column]);

    // @ts-expect-error TS7006
    const handleChangeSubresource = (event) => {
        const transformers = GET_TRANSFORMERS_FROM_SUBRESOURCE(
            subresources,
            event.target.value,
            null,
        );
        updateDefaultValueTransformers(transformers);
    };

    // @ts-expect-error TS7006
    const handleChange = (event, value) => {
        const transformers = GET_TRANSFORMERS_FROM_SUBRESOURCE(
            subresources,
            path,
            value,
        );
        updateDefaultValueTransformers(transformers);
    };

    return (
        <Box mt={5} display="flex" flexDirection="column" gap="2rem">
            <FormControl fullWidth>
                <InputLabel id="select-subresource-label">
                    {translate('subRessource_tooltip')}
                </InputLabel>
                <Select
                    labelId="select-subresource-label"
                    data-testid="select-subresource"
                    value={path}
                    label={translate('subRessource_tooltip')}
                    onChange={handleChangeSubresource}
                >
                    {/*
                     // @ts-expect-error TS7006 */}
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
                // @ts-expect-error TS2322
                labelId="autocomplete-subresource-label"
                data-testid="autocomplete-subresource-label"
                fullWidth
                options={datasetFields}
                value={autocompleteValue ?? ''}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={translate('from_columns')}
                        placeholder={translate('enter_from_columns')}
                    />
                )}
                onChange={handleChange}
            />
        </Box>
    );
};

export default SourceValueFromSubResource;
