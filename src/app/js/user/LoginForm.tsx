import { useTranslate } from '../i18n/I18NContext';
import { useForm } from 'react-hook-form';
import { TextField } from '../reactHookFormFields/TextField';
import { useMemo } from 'react';
import ButtonWithStatus from '../lib/components/ButtonWithStatus';
import { CardActions, CardContent } from '@mui/material';

const required = (text: string) => (value: unknown) =>
    value && !(value instanceof Array && value.length === 0) ? undefined : text;

type LoginFormProps = {
    onSubmit: (data: { username: string; password: string }) => void;
};

export const LoginFormComponent = ({ onSubmit }: LoginFormProps) => {
    const { translate } = useTranslate();
    const { handleSubmit, control, formState } = useForm<{
        username: string;
        password: string;
    }>({
        mode: 'onChange',
    });

    const { isSubmitting, isValid } = formState;

    const requiredField = useMemo(
        () => required(translate('error_field_required')),
        [translate],
    );
    return (
        <form id="login_form" onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
                <TextField
                    name="username"
                    label={translate('Username')}
                    control={control}
                    validate={requiredField}
                    autoFocus
                    fullWidth
                    variant="standard"
                />
                <TextField
                    name="password"
                    label={translate('Password')}
                    type="password"
                    control={control}
                    validate={requiredField}
                    fullWidth
                    variant="standard"
                />
            </CardContent>
            <CardActions>
                {/* 
                // @ts-expect-error TS2740 */}
                <ButtonWithStatus
                    loading={isSubmitting}
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    color="primary"
                >
                    {translate('Sign in')}
                </ButtonWithStatus>
            </CardActions>
        </form>
    );
};

export default LoginFormComponent;
