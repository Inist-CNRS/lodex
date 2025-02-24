import {
    Box,
    Button,
    Checkbox,
    MenuItem,
    Select,
    Tooltip,
    keyframes,
} from '@mui/material';
import React from 'react';

import { SaveAs } from '@mui/icons-material';
import HelpIcon from '@mui/icons-material/HelpOutline';
import { useForm, useStore } from '@tanstack/react-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { z } from 'zod';
import { loadConfigTenant } from '.';
import { useTranslate } from '../../i18n/I18NContext';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';
import CancelButton from '../../lib/components/CancelButton';
import Loading from '../../lib/components/Loading';
import { TextField } from '../../lib/components/TextField';
import { ConfigField } from './fields/ConfigField';
import { useGetAvailableThemes } from './useGetAvailableThemes';
import { useGetConfigTenant } from './useGetConfigTenant';
import { useUpdateConfigTenant } from './useUpdateConfigTenant';

const shake = keyframes`
10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(4px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-6px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(6px, 0, 0);
  }
`;

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
    antispamFilter: z
        .object({
            active: z.boolean(),
            recaptchaClientKey: z.string(),
            recaptchaSecretKey: z.string(),
        })
        .optional(),
    theme: z.string().min(1, {
        message: 'error_required',
    }),
    enrichmentBatchSize: z.coerce.number(),
    notificationEmail: z
        .string()
        .email({
            message: 'error_invalid_email',
        })
        .optional(),
});

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
}) => {
    const { translate, locale } = useTranslate();

    const form = useForm({
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
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                }}
            >
                <h2 id="user_auth">{translate('user_auth')}</h2>
                <Tooltip title={translate('user_auth_help')}>
                    <HelpIcon />
                </Tooltip>
                <form.Field name="userAuth.active">
                    {(field) => (
                        <Checkbox
                            checked={field.state.value}
                            onChange={(event) => {
                                field.handleChange(event.target.checked);
                            }}
                            inputProps={{
                                'aria-labelledby': 'user_auth',
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
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                }}
            >
                <h2 id="contributor_auth">{translate('contributor_auth')}</h2>
                <Tooltip title={translate('contributor_auth_help')}>
                    <HelpIcon />
                </Tooltip>
                <form.Field name="contributorAuth.active">
                    {(field) => (
                        <Checkbox
                            checked={field.state.value}
                            onChange={(event) => {
                                field.handleChange(event.target.checked);
                            }}
                            inputProps={{
                                'aria-labelledby': 'contributor_auth',
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

            <Box>
                <h2>{translate('notifications')}</h2>
                <TextField
                    label={translate('notification_email')}
                    name="notificationEmail"
                    form={form}
                />
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
                                    ...(configToUpdate?.front || {}),
                                    theme: themeValue.defaultVariables,
                                },
                            });
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
                <TextField
                    label={translate('recaptcha_client_key')}
                    name="antispamFilter.recaptchaClientKey"
                    form={form}
                    disabled={!antispamFilterActive}
                />

                <TextField
                    label={translate('recaptcha_secret_key')}
                    name="antispamFilter.recaptchaSecretKey"
                    form={form}
                    disabled={!antispamFilterActive}
                    type="password"
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
                    <Button
                        variant="contained"
                        className="btn-save"
                        color="primary"
                        type="submit"
                        disabled={isSubmitting}
                        startIcon={
                            isFormModified && (
                                <Tooltip title={translate('form_is_modified')}>
                                    <SaveAs />
                                </Tooltip>
                            )
                        }
                        sx={{
                            animation: isFormModified ? `${shake} 1s ease` : '',
                        }}
                    >
                        {translate('save')}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

ConfigTenantFormView.propTypes = {
    initialConfig: PropTypes.object.isRequired,
    availableThemes: PropTypes.array.isRequired,
    handleCancel: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
};

export const ConfigTenantForm = ({ loadConfigTenant }) => {
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

ConfigTenantForm.propTypes = {
    loadConfigTenant: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigTenantForm);
