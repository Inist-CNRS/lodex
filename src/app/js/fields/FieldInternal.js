import React from 'react';
import translate from 'redux-polyglot/translate';
import { Box, Typography } from '@mui/material';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../propTypes';

import FieldToggleInternalScope from './FieldToggleInternalScope';
import FieldInternalName from './FieldInternalName';
import FieldInput from '../lib/components/FieldInput';

export const FieldInternalComponent = ({ field, p: polyglot }) => {
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
                    {polyglot.t('internalScope')}
                </Typography>
                <FieldInput
                    name="internalScopes"
                    component={FieldToggleInternalScope}
                    labelKey="internalScope"
                    fullWidth
                />
            </Box>

            <FieldInternalName field={field} />
        </Box>
    );
};

FieldInternalComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldInternalComponent);
