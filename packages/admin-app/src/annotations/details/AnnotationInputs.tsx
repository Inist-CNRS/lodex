import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { useStore } from '@tanstack/react-form';

import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { AnnotationStatusChip } from '../AnnotationStatus';
import { FormHelperText } from '@mui/material';
import { statuses } from '@lodex/common';

interface AnnotationInputsProps {
    form: any;
}

export function AnnotationInputs({ form }: AnnotationInputsProps) {
    const { translate } = useTranslate();
    const isInternalCommentRequired = useStore(form.store, (state) => {
        // @ts-expect-error TS18046
        return ['validated', 'rejected'].includes(state.values.status);
    });
    return (
        <Stack
            gap={5}
            role="group"
            aria-label={translate('annotation_form_title')}
        >
            <form.Field name="status">
                {/*
                 // @ts-expect-error TS7006 */}
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
                                        {/* 
                                        // @ts-expect-error TS2322 */}
                                        <AnnotationStatusChip status={status} />
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
                {/*
                 // @ts-expect-error TS7006 */}
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
                            required={isInternalCommentRequired}
                        />
                    );
                }}
            </form.Field>
            <form.Field name="adminComment">
                {/*
                 // @ts-expect-error TS7006 */}
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
                {/*
                 // @ts-expect-error TS7006 */}
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
