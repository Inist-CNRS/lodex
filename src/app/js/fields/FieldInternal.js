import React from 'react';
import translate from 'redux-polyglot/translate';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../propTypes';

import FieldToggleInternalScope from './FieldToggleInternalScope';
import FieldInternalName from './FieldInternalName';
import FieldInput from '../lib/components/FieldInput';


const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: '2rem',
    },
});

export const FieldInternalComponent = field => {
    const classes = useStyles();
    return (
        <Box className={classes.container}>
            <FieldInput
                name="internalScope"
                component={FieldToggleInternalScope}
                labelKey="internalScope"
                fullWidth
            />
            <FieldInternalName field={field} />
        </Box>
    );
};

FieldInternalComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldInternalComponent);
