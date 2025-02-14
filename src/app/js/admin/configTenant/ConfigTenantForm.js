import React from 'react';
import {
    Box,
    Button,
    Checkbox,
    MenuItem,
    Select,
    Tooltip,
    keyframes,
} from '@mui/material';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CancelButton from '../../lib/components/CancelButton';
import { loadConfigTenant } from '.';
import { SaveAs } from '@mui/icons-material';
import HelpIcon from '@mui/icons-material/HelpOutline';
import { useTranslate } from '../../i18n/I18NContext';
import Loading from '../../lib/components/Loading';
import { useGetConfigTenant } from './useGetConfigTenant';
import { useGetAvailableThemes } from './useGetAvailableThemes';
import { useField, useForm, useStore } from '@tanstack/react-form';
import { TextField } from '../../lib/components/TextField';
import { ConfigField } from './fields/ConfigField';
import { z } from 'zod';
import { useUpdateConfigTenant } from './useUpdateConfigTenant';
import { useHistory } from 'react-router-dom';

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
    contributorAuth: z.object({
        active: z.boolean(),
        password: z.string().min(1, {
            message: 'error_required',
        }),
        username: z.string().min(1, {
            message: 'error_required',
        }),
    }),
    theme: z.string().min(1, {
        message: 'error_required',
    }),
    enrichmentBatchSize: z.number(),
});

export const ConfigTenantFormView = ({
    initialConfig: {
        _id,
        enableAutoPublication,
        userAuth,
        contributorAuth,
        theme,
        enrichmentBatchSize,
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
            enrichmentBatchSize,
            config,
        },

        onSubmit: async ({ value }) => {
            const {
                enableAutoPublication,
                userAuth,
                contributorAuth,
                theme,
                enrichmentBatchSize,
                _id,
                config,
            } = value;
            await handleSave({
                ...config,
                _id,
                enableAutoPublication,
                userAuth,
                contributorAuth,
                theme,
                enrichmentBatchSize,
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
        return state.values.contributorAuth.active;
    });
    const configTenantField = useField({
        name: 'configTenant',
        form,
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
                <h2>{translate('enableAutoPublication')}</h2>
                <form.Field name="enableAutoPublication">
                    {(field) => (
                        <Checkbox
                            checked={field.state.value}
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
                <h2>{translate('user_auth')}</h2>
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
                    label="Username"
                    name="userAuth.username"
                    form={form}
                    disabled={!userAuthActive}
                />

                <TextField
                    label="Password"
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
                <h2>{translate('contributor_auth')}</h2>
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
                    label="Username"
                    name="contributorAuth.username"
                    form={form}
                    disabled={!contributorAuthActive}
                />

                <TextField
                    label="Password"
                    name="contributorAuth.password"
                    form={form}
                    disabled={!contributorAuthActive}
                />
            </Box>

            <h2>{translate('theme')}</h2>
            <form.Field name="theme">
                {(field) => (
                    <Select
                        value={field.state.value}
                        style={{
                            width: 'min(505px, 100%)',
                        }}
                        sx={{ mb: 2 }}
                        onChange={(event) => {
                            field.handleChange(event.target.value);

                            try {
                                const themeValue = availableThemes.find(
                                    (value) =>
                                        value.value === event.target.value,
                                );

                                configTenantField.handleChange({
                                    ...currentConfig,
                                    front: {
                                        ...currentConfig.front,
                                        theme: themeValue.defaultVariables,
                                    },
                                });
                            } catch (_) {
                                /* empty */
                            }
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

            <h2>{translate('other')}</h2>
            <TextField
                label="Enrichment Batch Size"
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
