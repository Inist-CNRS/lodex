import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    MenuItem,
    Select,
    TextField,
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

export const ConfigTenantForm = ({ history, onLoadConfigTenant }) => {
    const { translate, locale } = useTranslate();
    const [initialConfig, setInitialConfig] = useState('');
    const [configTenant, setConfigTenant] = useState('');
    const [enableAutoPublication, setEnableAutoPublication] = useState(false);
    const [userAuth, setUserAuth] = useState({});
    const [contributorAuth, setContributorAuth] = useState({});
    const [enrichmentBatchSize, setEnrichmentBatchSize] = useState(0);
    const [id, setId] = useState('');
    const [isFormModified, setIsFormModified] = useState(false);
    const [theme, setTheme] = useState('default');
    const [themes, setThemes] = useState([
        {
            defaultVariables: {},
            name: {
                fr: 'Classique',
                en: 'Classic',
            },
            description: {
                fr: 'Thème Lodex Classique',
                en: 'Lodex Classic theme',
            },
            value: 'default',
        },
    ]);

    const { data, error, isLoading } = useGetConfigTenant();
    const availableThemesResponse = useGetAvailableThemes();

    useEffect(() => {
        async function fetchData() {
            setUserAuth(data.userAuth);
            setContributorAuth(data.contributorAuth);
            setEnrichmentBatchSize(data.enrichmentBatchSize);
            setId(data._id);
            setEnableAutoPublication(data.enableAutoPublication);
            setTheme(data.theme ?? 'default');

            const stringified = JSON.stringify(
                omit(data, [
                    'userAuth',
                    'enrichmentBatchSize',
                    '_id',
                    'enableAutoPublication',
                    'theme',
                ]),
                null,
                2,
            );
            setInitialConfig(stringified);
            setConfigTenant(stringified);

            setThemes(availableThemesResponse.data);
        }
        fetchData();
    }, [data, availableThemesResponse.data]);

    const handleSave = async () => {
        try {
            const configTenantToSave = JSON.parse(configTenant);
            configTenantToSave.userAuth = userAuth;
            configTenantToSave.contributorAuth = contributorAuth;
            configTenantToSave.enrichmentBatchSize = enrichmentBatchSize;
            configTenantToSave._id = id;
            configTenantToSave.enableAutoPublication = enableAutoPublication;
            configTenantToSave.theme = theme;

            const res = await updateConfigTenant(configTenantToSave);
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

    const handleConfigTenantChange = (newConfigTenant) => {
        setIsFormModified(true);
        setConfigTenant(newConfigTenant);
    };

    const handleThemeChange = (event) => {
        setIsFormModified(true);
        setTheme(event.target.value);

        try {
            const themeValue = themes.find(
                (value) => value.value === event.target.value,
            );

            try {
                const parsedConfig = JSON.parse(configTenant);

                if (parsedConfig.front) {
                    parsedConfig.front.theme = themeValue.defaultVariables;
                }

                setConfigTenant(JSON.stringify(parsedConfig, null, 2));
            } catch (_) {
                // If we can't parse the actual config fallback to the initial

                const parsedConfig = JSON.parse(initialConfig);

                if (parsedConfig.front) {
                    parsedConfig.front.theme = themeValue.defaultVariables;
                }

                setConfigTenant(JSON.stringify(parsedConfig, null, 2));
            }
        } catch (_) {
            /* empty */
        }
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
                <Checkbox
                    checked={enableAutoPublication}
                    onChange={(event) => {
                        setIsFormModified(true);
                        setEnableAutoPublication(event.target.checked);
                    }}
                />
            </Box>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    gap: 1,
                }}
            >
                <h2>{translate('user_auth')}</h2>
                <Checkbox
                    checked={userAuth?.active || false}
                    onChange={(event) => {
                        setIsFormModified(true);
                        setUserAuth({
                            ...userAuth,
                            active: event.target.checked,
                        });
                    }}
                />
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
                    value={userAuth?.username || ''}
                    disabled={!userAuth?.active}
                    onChange={(event) => {
                        setIsFormModified(true);
                        setUserAuth({
                            ...userAuth,
                            username: event.target.value,
                        });
                    }}
                />

                <TextField
                    label="Password"
                    value={userAuth?.password || ''}
                    disabled={!userAuth?.active}
                    onChange={(event) => {
                        setIsFormModified(true);
                        setUserAuth({
                            ...userAuth,
                            password: event.target.value,
                        });
                    }}
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
                <Checkbox
                    checked={contributorAuth?.active || false}
                    onChange={(event) => {
                        setIsFormModified(true);
                        setContributorAuth({
                            ...contributorAuth,
                            active: event.target.checked,
                        });
                    }}
                />
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
                    value={contributorAuth?.username || ''}
                    disabled={!contributorAuth?.active}
                    onChange={(event) => {
                        setIsFormModified(true);
                        setContributorAuth({
                            ...userAuth,
                            username: event.target.value,
                        });
                    }}
                />

                <TextField
                    label="Password"
                    value={contributorAuth?.password || ''}
                    disabled={!contributorAuth?.active}
                    onChange={(event) => {
                        setIsFormModified(true);
                        setContributorAuth({
                            ...contributorAuth,
                            password: event.target.value,
                        });
                    }}
                />
            </Box>

            <h2>{translate('theme')}</h2>
            <Select
                value={theme}
                style={{
                    width: 'min(505px, 100%)',
                }}
                sx={{ mb: 2 }}
                onChange={handleThemeChange}
            >
                {themes.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                        {t.name[locale]} - {t.description[locale]}
                    </MenuItem>
                ))}
            </Select>

            <h2>{translate('other')}</h2>
            <TextField
                label="Enrichment Batch Size"
                value={enrichmentBatchSize || ''}
                type="number"
                sx={{ mb: 2 }}
                onChange={(event) => {
                    setIsFormModified(true);
                    setEnrichmentBatchSize(Number(event.target.value));
                }}
            />
            <Box sx={{ mb: 10 }}>
                <AceEditor
                    placeholder="Placeholder Text"
                    mode="json"
                    fontSize={16}
                    theme="monokai"
                    showPrintMargin={false}
                    wrapEnabled={true}
                    showGutter={true}
                    value={configTenant}
                    onChange={handleConfigTenantChange}
                    width="100%"
                    setOptions={{
                        showLineNumbers: true,
                        tabSize: 2,
                    }}
                />
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
                        onClick={handleSave}
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
