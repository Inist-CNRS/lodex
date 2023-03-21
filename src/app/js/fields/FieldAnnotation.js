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
import { getFieldToAnnotateForSpecificScope } from '../../../common/scope';
import { Box, MenuItem, Typography } from '@mui/material';
import FieldRepresentation from './FieldRepresentation';

const FieldAnnotation = ({ fields, scope, p: polyglot, subresourceId }) => (
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
            SelectProps={{
                renderValue: option => (
                    <FieldRepresentation
                        field={fields.find(f => f.name === option)}
                        shortMode
                    />
                ),
            }}
        >
            <MenuItem value={null}>
                {polyglot.t('completes_field_none')}
            </MenuItem>
            {getFieldToAnnotateForSpecificScope(
                fields,
                scope,
                subresourceId,
            ).map(f => (
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
                    <FieldRepresentation field={f} />
                </MenuItem>
            ))}
        </Field>
    </Box>
);

FieldAnnotation.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    scope: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
    subresourceId: PropTypes.string,
};

export default translate(FieldAnnotation);
