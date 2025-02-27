import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import React from 'react';

import { useTranslate } from '../../../i18n/I18NContext';
import { AnnotationStatus, statuses } from '../AnnotationStatus';
import { FormHelperText } from '@mui/material';

export function AnnotationInputs({ form }) {
    const { translate } = useTranslate();

    return (
        <Stack
            gap={5}
            role="group"
            aria-label={translate('annotation_form_title')}
        >
            <form.Field name="status">
                {(field) => {
                    return (
                        <FormControl fullWidth>
                            <InputLabel id="annotation-status-label">
                                {translate('annotation_status')}
                            </InputLabel>

                            <Select
                                labelId="annotation-status-label"
                                label={translate('annotation_status')}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                value={field.state.value}
                            >
                                {statuses.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        <AnnotationStatus status={status} />
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                {translate('annotation_status_help')}
                            </FormHelperText>
                        </FormControl>
                    );
                }}
            </form.Field>
            <form.Field name="internalComment">
                {(field) => {
                    const hasErrors = !!(
                        field.state.meta.isTouched &&
                        field.state.meta.errors?.length
                    );
                    return (
                        <TextField
                            label={translate('annotation_internal_comment')}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            minRows={5}
                            maxRows={10}
                            multiline
                            error={hasErrors}
                            required
                        />
                    );
                }}
            </form.Field>
            <form.Field name="adminComment">
                {(field) => {
                    const hasErrors = !!(
                        field.state.meta.isTouched &&
                        field.state.meta.errors?.length
                    );
                    return (
                        <TextField
                            label={translate('annotation_admin_comment')}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            minRows={5}
                            maxRows={10}
                            multiline
                            error={hasErrors}
                        />
                    );
                }}
            </form.Field>

            <form.Field name="administrator">
                {(field) => {
                    const hasErrors = !!(
                        field.state.meta.isTouched &&
                        field.state.meta.errors?.length
                    );
                    return (
                        <TextField
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            label={translate('annotation_administrator')}
                            error={hasErrors}
                        />
                    );
                }}
            </form.Field>
        </Stack>
    );
}

AnnotationInputs.propTypes = {
    form: PropTypes.object.isRequired,
};
