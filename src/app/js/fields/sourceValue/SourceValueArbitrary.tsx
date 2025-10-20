import { useState } from 'react';
import { Box, TextField } from '@mui/material';
import { useTranslate } from '../../i18n/I18NContext';
import type { TransformerDraft } from '../types.ts';

interface SourceValueArbitraryProps {
    updateDefaultValueTransformers(...args: unknown[]): unknown;
    value?: string;
}

const SourceValueArbitrary = ({
    updateDefaultValueTransformers,
    value
}: SourceValueArbitraryProps) => {
    const { translate } = useTranslate();

    const [valueInput, setValueInput] = useState(value || '');
    // @ts-expect-error TS7006
    const handleChange = (event) => {
        setValueInput(event.target.value);
        updateDefaultValueTransformers([
            {
                operation: 'VALUE',
                args: [
                    {
                        name: 'value',
                        type: 'string',
                        value: event.target.value,
                    },
                ],
            },
        ]);
    };

    return (
        <Box mt={5} display="flex" alignItems="center">
            <TextField
                fullWidth
                placeholder={translate('enter_an_arbitrary_value')}
                label={translate('arbitrary_value')}
                onChange={handleChange}
                value={valueInput}
                multiline
            />
        </Box>
    );
};

export default SourceValueArbitrary;
