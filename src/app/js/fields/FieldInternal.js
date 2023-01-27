import React from 'react';
import translate from 'redux-polyglot/translate';
import { Box } from '@mui/material';
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
            sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                alignItems: 'center',
                paddingTop: '2rem',
                '& .MuiTextField-root': {
                    flex: 1,
                },
            }}
        >
            <FieldInternalName field={field} />
            <Box>{polyglot.t('used_in')}</Box>
            <FieldInput
                name="internalScopes"
                component={FieldToggleInternalScope}
                labelKey="internalScope"
                fullWidth
            />
        </Box>
    );
};

FieldInternalComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldInternalComponent);
