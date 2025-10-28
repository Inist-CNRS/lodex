import React, { useEffect } from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { fromParsing } from '../../../../../packages/admin-app/src/selectors';
import { parseValue } from '@lodex/common';
import { useTranslate } from '../../i18n/I18NContext';
import { fromI18n } from '../../../../../packages/public-app/src/selectors';
import type { TransformerDraft } from '../types.ts';
import type { SubResource } from '../../../../../packages/admin-app/src/subresource';

const SourceValueFromColumnsForSubResource = ({
    updateDefaultValueTransformers,
    value,
    selectedSubresourceUri,
}: {
    updateDefaultValueTransformers: (transformers: TransformerDraft[]) => void;
    value?: string | null;
    selectedSubresourceUri?: string;
}) => {
    const { translate } = useTranslate();
    const { datasetFields, subresourcePath } = useSelector((state: any) => {
        const { subresources } = state.subresource;

        const subresource = subresources.find(
            (s: SubResource) => s._id === selectedSubresourceUri,
        );
        const [firstParsedLine] = fromParsing.getExcerptLines(state);

        if (!subresource || !firstParsedLine) {
            return {};
        }

        const subresourceData = parseValue(
            firstParsedLine[subresource.path] || '',
        );

        return {
            datasetFields: [
                ...Object.keys(
                    (Array.isArray(subresourceData)
                        ? subresourceData[0]
                        : subresourceData) || {},
                ),
                ...[fromI18n.getPhrases(state)['other']],
            ].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())),
            subresourcePath: subresource.path,
        };
    });

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
                options={datasetFields ?? []}
                value={autocompleteValue ?? []}
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

export default SourceValueFromColumnsForSubResource;
