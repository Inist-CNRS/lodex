import { useTranslate } from '../i18n/I18NContext';
import { FormProvider, useForm } from 'react-hook-form';
import { TextField } from '../reactHookFormFields/TextField';
import ButtonWithStatus from '../lib/components/ButtonWithStatus';
import { CardActions, CardContent } from '@mui/material';
import { useLogin } from '../api/login';
import Alert from '../lib/components/Alert';

const styles = {
    alert: {
        width: '100%',
    },
};

export const LoginFormComponent = () => {
    const { translate } = useTranslate();

    const { login: onSubmit, error, isLoading } = useLogin();

    const formMethods = useForm<{
        username: string;
        password: string;
    }>({
        mode: 'onChange',
    });
    const { handleSubmit, formState } = formMethods;

    const { isSubmitting, isValid } = formState;

    return (
        <FormProvider {...formMethods}>
            <form
                id="login_form"
                onSubmit={handleSubmit((data) => onSubmit(data))}
            >
                <CardContent>
                    {error && (
                        <Alert style={styles.alert}>
                            <p>{translate(error.message)}</p>
                        </Alert>
                    )}
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
                    {/* @ts-expect-error TS2740 */}
                    <ButtonWithStatus
                        loading={isSubmitting}
                        type="submit"
                        disabled={!isValid || isSubmitting || isLoading}
                        color="primary"
                    >
                        {translate('Sign in')}
                    </ButtonWithStatus>
                </CardActions>
            </form>
        </FormProvider>
    );
};

export default LoginFormComponent;
