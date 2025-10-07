import PropTypes from 'prop-types';

import { Box, MenuItem, Typography } from '@mui/material';
import { getFieldToCaptionForSpecificScope } from '../../../common/scope';
import { useTranslate } from '../i18n/I18NContext';
import getFieldClassName from '../lib/getFieldClassName';
import { field as fieldPropTypes } from '../propTypes';
import FieldRepresentation from './FieldRepresentation';
import type { Field } from './types.ts';
import { TextField } from '../reactHookFormFields/TextField.tsx';

const FieldCaption = ({
    fields,
    scope,
    subresourceId,
}: {
    fields: Field[];
    scope: string;
    subresourceId?: string;
}) => {
    const { translate } = useTranslate();

    return (
        <Box mt={5}>
            <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                {translate('caption_field')}
            </Typography>
            <TextField
                className="completes"
                name="completes"
                label={translate('field_to_caption')}
                select
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
                {/* @ts-expect-error TS2769 */}
                <MenuItem value={null}>
                    {translate('completes_field_none')}
                </MenuItem>
                {getFieldToCaptionForSpecificScope(
                    fields,
                    scope,
                    subresourceId,
                    // @ts-expect-error TS7006
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
            </TextField>
        </Box>
    );
};

FieldCaption.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    scope: PropTypes.string.isRequired,
    subresourceId: PropTypes.string,
};

export default FieldCaption;
