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
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { updateConfigTenant } from '../api/configTenant';
import PropTypes from 'prop-types';
import CancelButton from '../../lib/components/CancelButton';
import { toast } from '../../../../common/tools/toast';
import { loadConfigTenant } from '.';
import { SaveAs } from '@mui/icons-material';
import { useTranslate } from '../../i18n/I18NContext';
import Loading from '../../lib/components/Loading';
import { omit } from 'lodash';
import { useGetConfigTenant } from './useGetConfigTenant';
import { useGetAvailableThemes } from './useGetAvailableThemes';
import { useField, useForm, useStore } from '@tanstack/react-form';
import { TextField } from '../../lib/components/TextField';

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

export const ConfigTenantFormView = ({
    initialConfig: {
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
}) => {
    const { translate, locale } = useTranslate();

    const form = useForm({
        defaultValues: {
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
                config,
            } = value;
            await handleSave({
                ...config,
                enableAutoPublication,
                userAuth,
                contributorAuth,
                theme,
                enrichmentBatchSize,
            });
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
        <Box className="container">
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
                }}
            >
                <h2>{translate('user_auth')}</h2>
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
                }}
            >
                <h2>{translate('contributor_auth')}</h2>
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
                                    ...defaultConfig,
                                    front: {
                                        ...defaultConfig.front,
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
                    {(field) => (
                        <AceEditor
                            placeholder="Placeholder Text"
                            mode="json"
                            fontSize={16}
                            theme="monokai"
                            showPrintMargin={false}
                            wrapEnabled={true}
                            showGutter={true}
                            value={
                                field.state.value
                                    ? JSON.stringify(field.state.value, null, 2)
                                    : ''
                            }
                            onChange={(value) => {
                                field.handleChange(
                                    value ? JSON.parse(value) : null,
                                );
                            }}
                            width="100%"
                            setOptions={{
                                showLineNumbers: true,
                                tabSize: 2,
                            }}
                        />
                    )}
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

export const ConfigTenantForm = ({ history, onLoadConfigTenant }) => {
    const { translate, locale } = useTranslate();

    const { data, error, isLoading } = useGetConfigTenant();
    const availableThemesResponse = useGetAvailableThemes();

    const handleSave = async (data) => {
        try {
            const res = await updateConfigTenant(data);
            if (res.error) {
                toast(`${translate('error')} : ${res.error}`, {
                    type: toast.TYPE.ERROR,
                });
            } else {
                toast(translate('configTenantUpdated'), {
                    type: toast.TYPE.SUCCESS,
                });
                onLoadConfigTenant();
            }
        } catch (e) {
            toast(`${translate('error')} : ${e}`, {
                type: toast.TYPE.ERROR,
            });
        }
    };

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
            handleSave={handleSave}
            handleCancel={handleCancel}
        />
    );
};

const mapStateToProps = () => ({});
const mapDispatchToProps = {
    onLoadConfigTenant: loadConfigTenant,
};

ConfigTenantForm.propTypes = {
    history: PropTypes.object.isRequired,
    onLoadConfigTenant: PropTypes.func.isRequired,
};

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(ConfigTenantForm);
