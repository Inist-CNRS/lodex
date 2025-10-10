import { Box, Typography } from '@mui/material';

import FormatEdition from '../formats/FormatEdition';
import { useTranslate } from '../i18n/I18NContext';

const FieldFormatInput = () => {
    const { translate } = useTranslate();

    return (
        <Box mt={5} id="step-value-format">
            <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                {translate('display_with_format')}
            </Typography>
            <FormatEdition />
        </Box>
    );
};

export default FieldFormatInput;
