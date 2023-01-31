import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import translate from 'redux-polyglot/translate';

import FormSelectField from '../lib/components/FormSelectField';
import getFieldClassName from '../lib/getFieldClassName';
import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../propTypes';
import { hasSimilarScope } from '../../../common/scope';
import FieldInternalIcon from './FieldInternalIcon';
import { Box, MenuItem, Typography } from '@mui/material';

const FieldAnnotation = ({ fields, scope, p: polyglot }) => (
    <Box mt={5}>
        <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
            {polyglot.t('annotate_field')}
        </Typography>
        <Field
            className="completes"
            name="completes"
            label={polyglot.t('field_to_annotate')}
            component={FormSelectField}
            fullWidth
        >
            <MenuItem value={null}>
                {polyglot.t('completes_field_none')}
            </MenuItem>
            {fields.filter(hasSimilarScope(scope)).map(f => (
                <MenuItem
                    className={`completes-${getFieldClassName(f)}`}
                    key={f.name}
                    value={f.name}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div>{f.label}</div>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {f.internalScopes &&
                            f.internalScopes.map(internalScope => (
                                <FieldInternalIcon
                                    key={internalScope}
                                    scope={internalScope}
                                />
                            ))}
                        {f.internalName}
                    </Box>
                </MenuItem>
            ))}
        </Field>
    </Box>
);

FieldAnnotation.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    scope: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldAnnotation);
