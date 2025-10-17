import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, TextField } from '@mui/material';
import { useTranslate } from '../../i18n/I18NContext';
import type { TransformerDraft } from '../types.ts';

const SourceValueArbitrary = ({
    updateDefaultValueTransformers,
    value,
}: {
    updateDefaultValueTransformers: (transformers: TransformerDraft[]) => void;
    value?: string | null;
}) => {
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

SourceValueArbitrary.propTypes = {
    updateDefaultValueTransformers: PropTypes.func.isRequired,
    value: PropTypes.string,
};

export default SourceValueArbitrary;
