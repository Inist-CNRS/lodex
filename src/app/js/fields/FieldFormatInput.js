import React from 'react';
import { polyglot as polyglotPropTypes } from '../propTypes';
import { Box, Typography } from '@mui/material';

import FormatEdition from '../formats/FormatEdition';
import FieldInput from '../lib/components/FieldInput';
import { translate } from '../i18n/I18NContext';

const FieldFormatInput = ({ p: polyglot }) => (
    <Box mt={5} id="step-value-format">
        <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
            {polyglot.t('display_with_format')}
        </Typography>
        <FieldInput name="format" component={FormatEdition} labelKey="format" />
    </Box>
);

FieldFormatInput.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldFormatInput);
