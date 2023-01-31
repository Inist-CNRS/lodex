import { Box } from '@mui/material';
import React from 'react';

import FormatEdition from '../formats/FormatEdition';
import FieldInput from '../lib/components/FieldInput';

const FieldFormatInput = () => (
    <Box mt={5} id="step-value-format">
        <FieldInput name="format" component={FormatEdition} labelKey="format" />
    </Box>
);

export default FieldFormatInput;
