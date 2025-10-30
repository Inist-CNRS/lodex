import {
    Box,
    Checkbox,
    FormControl,
    FormHelperText,
    MenuItem,
    Select,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';

import HelpIcon from '@mui/icons-material/HelpOutline';
import { useForm, useStore } from '@tanstack/react-form';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { z } from 'zod';
import { loadConfigTenant } from './index';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import AdminOnlyAlert from '../../../../src/app/js/lib/components/AdminOnlyAlert';
import CancelButton from '../../../../src/app/js/lib/components/CancelButton';
import Loading from '../../../../src/app/js/lib/components/Loading';
import { SaveButton } from '../../../../src/app/js/lib/components/SaveButton';
import { TextField } from '../../../../src/app/js/lib/components/TextField';
import { ConfigField } from './fields/ConfigField';
import { useGetAvailableThemes } from './useGetAvailableThemes';
import { useGetConfigTenant } from './useGetConfigTenant';
import { useUpdateConfigTenant } from './useUpdateConfigTenant';

const configTenantSchema = z.object({
    config: z.object(
        {},
        {
            message: 'error_invalid_json',
        },
    ),
    enableAutoPublication: z.boolean(),
    userAuth: z.object({
        active: z.boolean(),
        password: z.string().min(1, {
            message: 'error_required',
        }),
        username: z.string().min(1, {
            message: 'error_required',
        }),
    }),
    contributorAuth: z
        .object({
            active: z.boolean(),
            password: z.string().min(1, {
                message: 'error_required',
            }),
            username: z.string().min(1, {
                message: 'error_required',
            }),
        })
        .optional(),
    antispamFilter: z.discriminatedUnion('active', [
        z.object({
            active: z.literal(true),
            recaptchaClientKey: z
                .string({ invalid_type_error: 'error_required' })
                .trim()
                .min(1, {
                    message: 'error_required',
                }),
            recaptchaSecretKey: z
                .string({ invalid_type_error: 'error_required' })
                .trim()
                .min(1, {
                    message: 'error_required',
                }),
        }),
        z.object({
            active: z.literal(false),
            recaptchaClientKey: z.string().trim().min(0).nullish(),
            recaptchaSecretKey: z.string().trim().min(0).nullish(),
        }),
    ]),
    theme: z.string().min(1, {
        message: 'error_required',
    }),
    enrichmentBatchSize: z.coerce.number(),
    notificationEmail: z
        .string()
        .email({
            message: 'error_invalid_email',
        })
        .nullish(),
});
type Config = z.infer<typeof configTenantSchema>;

interface ConfigTenantFormViewProps {
    initialConfig: Config & { _id: string };
    availableThemes: {
        defaultVariables: Record<string, string>;
        description: {
            [key: string]: string;
        };
        name: {
            en: string;
            fr: string;
        };
        value: string;
    }[];
    handleCancel(...args: unknown[]): unknown;
    handleSave(...args: unknown[]): unknown;
    isSubmitting?: boolean;
}

export const ConfigTenantFormView = ({
    initialConfig: {
        _id,
        enableAutoPublication,
        userAuth,
        contributorAuth,
        theme,
        antispamFilter,
        enrichmentBatchSize,
        notificationEmail,
        ...config
    },
    availableThemes,
    handleCancel,
    handleSave,
    isSubmitting,
}: ConfigTenantFormViewProps) => {
    const { translate, locale } = useTranslate();

    const form = useForm<
        Config & {
            _id?: string;
        }
    >({
        defaultValues: {
            _id,
            enableAutoPublication,
            userAuth,
            contributorAuth,
            theme,
            antispamFilter,
            enrichmentBatchSize,
            notificationEmail,
            config,
        },

        onSubmit: async ({ value }) => {
            const {
                enableAutoPublication,
                userAuth,
                contributorAuth,
                theme,
                antispamFilter,
                enrichmentBatchSize,
                _id,
                notificationEmail,
                config,
            } = value;

            await handleSave({
                ...config,
                _id,
                enableAutoPublication,
                userAuth,
                contributorAuth,
                theme,
                antispamFilter,
                enrichmentBatchSize,
                notificationEmail,
            });
        },
        validators: {
            onChange: configTenantSchema,
        },
    });

    const userAuthActive = useStore(form.store, (state) => {
        return state.values.userAuth.active;
    });

    const currentConfig = useStore(form.store, (state) => {
        return state.values.config;
    });

    const contributorAuthActive = useStore(form.store, (state) => {
        return state.values.contributorAuth?.active;
    });

    const antispamFilterActive = useStore(form.store, (state) => {
        return state.values.antispamFilter?.active;
    });

    const isFormModified = useStore(form.store, (state) => {
        return state.isDirty;
    });

    return (
        <Box
            className="container"
            component="form"
            onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                form.handleSubmit();
            }}
        >
            <h1>{translate('config_tenant')}</h1>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    gap: 1,
                }}
            >
                <h2 id="enableAutoPublication">
                    {translate('enableAutoPublication')}
                </h2>
                <form.Field name="enableAutoPublication">
                    {(field) => (
                        <Checkbox
                            checked={field.state.value}
                            inputProps={{
                                'aria-labelledby': 'enableAutoPublication',
                            }}
                            onChange={(event) => {
                                field.handleChange(event.target.checked);
                            }}
                        />
                    )}
                </form.Field>
            </Box>
            <Stack>
                <h2>{translate('user_auth')}</h2>
                <Stack>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <h3 id="user">{translate('user')}</h3>
                        <Tooltip title={translate('user_auth_help')}>
                            <HelpIcon />
                        </Tooltip>
                        <form.Field name="userAuth.active">
                            {(field) => (
                                <Checkbox
                                    checked={field.state.value}
                                    onChange={(event) => {
                                        field.handleChange(
                                            event.target.checked,
                                        );
                                    }}
                                    inputProps={{
                                        'aria-labelledby': 'user',
                                    }}
                                />
                            )}
                        </form.Field>
                    </Box>

                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        <TextField
                            label={translate('Username')}
                            name="userAuth.username"
                            form={form}
                            disabled={!userAuthActive}
                        />

                        <TextField
                            label={translate('Password')}
                            name="userAuth.password"
                            form={form}
                            disabled={!userAuthActive}
                        />
                    </Box>
                </Stack>
                <Stack>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <h3 id="contributor">{translate('contributor')}</h3>
                        <Tooltip title={translate('contributor_auth_help')}>
                            <HelpIcon />
                        </Tooltip>
                        <form.Field name="contributorAuth.active">
                            {(field) => (
                                <Checkbox
                                    checked={field.state.value}
                                    onChange={(event) => {
                                        field.handleChange(
                                            event.target.checked,
                                        );
                                    }}
                                    inputProps={{
                                        'aria-labelledby': 'contributor',
                                    }}
                                />
                            )}
                        </form.Field>
                    </Box>

                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        <TextField
                            label={translate('Username')}
                            name="contributorAuth.username"
                            form={form}
                            disabled={!contributorAuthActive}
                        />

                        <TextField
                            label={translate('Password')}
                            name="contributorAuth.password"
                            form={form}
                            disabled={!contributorAuthActive}
                        />
                    </Box>
                </Stack>

                <Typography>
                    {translate(
                        userAuthActive
                            ? 'instance_is_private'
                            : 'instance_is_public',
                    )}{' '}
                    {translate(
                        contributorAuthActive
                            ? 'only_contributor_can_annotate'
                            : 'everyone_can_contribute',
                    )}
                </Typography>
            </Stack>

            <Box>
                <h2>{translate('notifications')}</h2>

                <FormControl fullWidth>
                    <TextField
                        label={translate('notification_email')}
                        name="notificationEmail"
                        form={form}
                    />
                    <FormHelperText>
                        {translate('notification_email_help')}
                    </FormHelperText>
                </FormControl>
            </Box>

            <h2 id="theme">{translate('theme')}</h2>
            <form.Field name="theme">
                {(field) => (
                    <Select
                        value={field.state.value}
                        style={{
                            width: 'min(505px, 100%)',
                        }}
                        sx={{ mb: 2 }}
                        inputProps={{
                            'aria-labelledby': 'theme',
                        }}
                        onChange={(event) => {
                            field.handleChange(event.target.value);

                            const themeValue = availableThemes.find(
                                (value) => value.value === event.target.value,
                            );

                            const configToUpdate =
                                currentConfig === 'invalid_json'
                                    ? config
                                    : currentConfig;

                            form.setFieldValue('config', {
                                ...(configToUpdate || {}),
                                front: {
                                    // @ts-expect-error TS2339
                                    ...(configToUpdate?.front || {}),
                                    theme: themeValue!.defaultVariables,
                                },
                            });
                            // @ts-expect-error TS2554
                            form.validateField('config');
                        }}
                    >
                        {availableThemes.map((t) => (
                            <MenuItem key={t.value} value={t.value}>
                                {t.name[locale]} - {t.description[locale]}
                            </MenuItem>
                        ))}
                    </Select>
                )}
            </form.Field>

            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                }}
            >
                <h2 id="antispam_filter">{translate('antispam_filter')}</h2>
                <form.Field name="antispamFilter.active">
                    {(field) => (
                        <Checkbox
                            checked={field.state.value}
                            onChange={(event) => {
                                field.handleChange(event.target.checked);
                                if (!event.target.checked) {
                                    // @ts-expect-error TS2554
                                    form.validateField(
                                        'antispamFilter.recaptchaClientKey',
                                    );
                                    // @ts-expect-error TS2554
                                    form.validateField(
                                        'antispamFilter.recaptchaSecretKey',
                                    );
                                }
                            }}
                            inputProps={{
                                'aria-labelledby': 'antispam_filter',
                            }}
                        />
                    )}
                </form.Field>
            </Box>

            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    gap: 2,
                    mb: 4,
                }}
            >
                <FormControl fullWidth>
                    <TextField
                        label={translate('recaptcha_client_key')}
                        name="antispamFilter.recaptchaClientKey"
                        form={form}
                        disabled={!antispamFilterActive}
                    />
                    <FormHelperText>
                        {translate('recaptcha_test_configuration')}
                    </FormHelperText>
                </FormControl>

                <TextField
                    label={translate('recaptcha_secret_key')}
                    name="antispamFilter.recaptchaSecretKey"
                    form={form}
                    disabled={!antispamFilterActive}
                    type="password"
                    // @ts-expect-error TS2322
                    fullWidth
                />
            </Box>

            <h2>{translate('other')}</h2>
            <TextField
                label={translate('enrichment_batch_size')}
                name="enrichmentBatchSize"
                form={form}
                type="number"
                sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 10 }}>
                <form.Field name="config">
                    {/*
                     // @ts-expect-error TS2322 */}
                    {(field) => <ConfigField field={field} form={form} />}
                </form.Field>
            </Box>
            <Box
                sx={{
                    position: 'fixed',
                    textAlign: 'right',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'white',
                    boxShadow: '-3px -12px 15px -3px rgba(0,0,0,0.1)',
                    padding: '1rem',
                    maxHeight: 70,
                    zIndex: 999,
                }}
                className="mui-fixed"
            >
                <Box className="container">
                    <CancelButton
                        sx={{ height: '100%' }}
                        onClick={handleCancel}
                    >
                        {translate('cancel')}
                    </CancelButton>
                    <SaveButton
                        isFormModified={isFormModified}
                        type="submit"
                        disabled={isSubmitting}
                    />
                </Box>
            </Box>
        </Box>
    );
};

interface ConfigTenantFormProps {
    loadConfigTenant(...args: unknown[]): unknown;
}

export const ConfigTenantForm = ({
    loadConfigTenant,
}: ConfigTenantFormProps) => {
    const history = useHistory();
    const { translate } = useTranslate();

    const { data, error, isLoading } = useGetConfigTenant();
    const availableThemesResponse = useGetAvailableThemes();

    const { handleUpdateConfigTenant, isSubmitting } = useUpdateConfigTenant();

    const handleCancel = () => {
        history.push('/data');
    };

    if (isLoading || availableThemesResponse.isLoading) {
        return <Loading>{translate('loading')}</Loading>;
    }

    if (error) {
        console.error(error);
        return (
            <AdminOnlyAlert>
                {translate('config_tenant_query_error')}
            </AdminOnlyAlert>
        );
    }
    if (availableThemesResponse.error) {
        console.error(availableThemesResponse.error);
        return (
            <AdminOnlyAlert>
                {translate('available_themes_query_error')}
            </AdminOnlyAlert>
        );
    }

    return (
        <ConfigTenantFormView
            initialConfig={data}
            availableThemes={availableThemesResponse.data}
            handleSave={(data) => {
                handleUpdateConfigTenant(data);
                // update configTenant in redux store
                loadConfigTenant();
            }}
            handleCancel={handleCancel}
            isSubmitting={isSubmitting}
        />
    );
};

const mapStateToProps = () => ({});
const mapDispatchToProps = {
    loadConfigTenant: loadConfigTenant,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigTenantForm);
