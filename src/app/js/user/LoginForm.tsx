import { useTranslate } from '../i18n/I18NContext';
import { useForm } from 'react-hook-form';
import { TextField } from '../reactHookFormFields/TextField';
import ButtonWithStatus from '../lib/components/ButtonWithStatus';
import { CardActions, CardContent } from '@mui/material';

type LoginFormProps = {
    onSubmit: (data: { username: string; password: string }) => void;
};

export const LoginFormComponent = ({ onSubmit }: LoginFormProps) => {
    const { translate } = useTranslate();
    const { handleSubmit, formState } = useForm<{
        username: string;
        password: string;
    }>({
        mode: 'onChange',
    });

    const { isSubmitting, isValid } = formState;

    return (
        <form id="login_form" onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
                <TextField
                    name="username"
                    label={translate('Username')}
                    required
                    autoFocus
                    fullWidth
                    variant="standard"
                />
                <TextField
                    name="password"
                    label={translate('Password')}
                    type="password"
                    required
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
