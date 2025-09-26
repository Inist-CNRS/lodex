import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';

import { Box, MenuItem, Typography } from '@mui/material';
import { getFieldToCaptionForSpecificScope } from '../../../common/scope';
import { translate } from '../i18n/I18NContext';
import FormSelectField from '../lib/components/FormSelectField';
import getFieldClassName from '../lib/getFieldClassName';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../propTypes';
import FieldRepresentation from './FieldRepresentation';

const FieldCaption = ({ fields, scope, p: polyglot, subresourceId }) => (
    <Box mt={5}>
        <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
            {polyglot.t('caption_field')}
        </Typography>
        <Field
            className="completes"
            name="completes"
            label={polyglot.t('field_to_caption')}
            component={FormSelectField}
            fullWidth
            SelectProps={{
                renderValue: (option) => (
                    <FieldRepresentation
                        field={fields.find((f) => f.name === option)}
                        shortMode
                    />
                ),
            }}
        >
            <MenuItem value={null}>
                {polyglot.t('completes_field_none')}
            </MenuItem>
            {getFieldToCaptionForSpecificScope(
                fields,
                scope,
                subresourceId,
            ).map((f) => (
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

FieldCaption.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    scope: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
    subresourceId: PropTypes.string,
};

export default translate(FieldCaption);
