import { Box } from '@mui/material';
import React from 'react';

import FieldInput from '../lib/components/FieldInput';
import FormSwitchField from '../lib/components/FormSwitchField';

export default function FieldAnnotableInput() {
    return (
        <Box
            sx={{
                marginBlockStart: 3,
            }}
        >
            <FieldInput
                name="annotable"
                component={FormSwitchField}
                labelKey="field_annotable"
            />
        </Box>
    );
}

FieldAnnotableInput.propTypes = {};
