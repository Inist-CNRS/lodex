import { Box, Typography } from '@mui/material';

import FieldToggleInternalScope from './FieldToggleInternalScope';
import FieldInternalName from './FieldInternalName';
import { useTranslate } from '../i18n/I18NContext.tsx';

export const FieldInternalComponent = () => {
    const { translate } = useTranslate();

    return (
        <Box
            display="flex"
            flexDirection="row"
            gap="60px"
            alignItems="flex-end"
            sx={{
                paddingTop: '2rem',
                '& .MuiTextField-root': {
                    flex: 1,
                },
            }}
        >
            <Box display="flex" flexDirection="column">
                <Typography variant="caption" gutterBottom>
                    {translate('internalScope')}
                </Typography>
                <FieldToggleInternalScope name="internalScopes" />
            </Box>

            <FieldInternalName />
        </Box>
    );
};

export default FieldInternalComponent;
