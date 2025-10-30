import React, { useEffect } from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { fromParsing } from '../../../../../packages/admin-app/src/selectors';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import type { TransformerDraft } from '../types.ts';

const SourceValueFromColumns = ({
    updateDefaultValueTransformers,
    value,
}: {
    updateDefaultValueTransformers: (transformers: TransformerDraft[]) => void;
    value?: string[] | null;
}) => {
    const { translate } = useTranslate();
    const datasetFields = useSelector((state: any) =>
        fromParsing
            .getParsedExcerptColumns(state)
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())),
    );
    const [autocompleteValue, setAutocompleteValue] = React.useState(value);
    useEffect(() => {
        setAutocompleteValue(value);
    }, [value]);

    // @ts-expect-error TS7006
    const handleChange = (event, value) => {
        setAutocompleteValue(value);
        updateDefaultValueTransformers([
            {
                operation: value.length > 1 ? 'CONCAT' : 'COLUMN',
                args:
                    value.length !== 0
                        ? // @ts-expect-error TS7006
                          value.map((v) => ({
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

export default SourceValueFromColumns;
