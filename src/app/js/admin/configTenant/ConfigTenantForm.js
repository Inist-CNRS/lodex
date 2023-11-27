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

import translate from 'redux-polyglot/translate';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { withRouter } from 'react-router';
import {
    getConfigTenant,
    getConfigTenantAvailableTheme,
    updateConfigTenant,
} from '../api/configTenant';
import PropTypes from 'prop-types';
import CancelButton from '../../lib/components/CancelButton';
import { toast } from '../../../../common/tools/toast';
import { loadConfigTenant } from '.';
import { SaveAs } from '@mui/icons-material';

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

export const ConfigTenantForm = ({
    p: polyglot,
    history,
    onLoadConfigTenant,
}) => {
    const [configTenant, setConfigTenant] = useState('');
    const [enableAutoPublication, setEnableAutoPublication] = useState(false);
    const [userAuth, setUserAuth] = useState({});
    const [enrichmentBatchSize, setEnrichmentBatchSize] = useState(0);
    const [id, setId] = useState('');
    const [isFormModified, setIsFormModified] = useState(false);
    const [theme, setTheme] = useState('default');
    const [themes, setThemes] = useState([
        {
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

    useEffect(() => {
        async function fetchData() {
            const { response } = await getConfigTenant();
            setUserAuth(response.userAuth);
            setEnrichmentBatchSize(response.enrichmentBatchSize);
            setId(response._id);
            setEnableAutoPublication(response.enableAutoPublication);
            setTheme(response.theme ?? 'default');
            delete response.userAuth;
            delete response.enrichmentBatchSize;
            delete response._id;
            delete response.enableAutoPublication;
            delete response.theme;

            const stringified = JSON.stringify(response, null, 2);
            setConfigTenant(stringified);

            const themesResponse = await getConfigTenantAvailableTheme();
            setThemes(themesResponse.response);
        }
        fetchData();
    }, []);

    const handleSave = async () => {
        try {
            const configTenantToSave = JSON.parse(configTenant);
            configTenantToSave.userAuth = userAuth;
            configTenantToSave.enrichmentBatchSize = enrichmentBatchSize;
            configTenantToSave._id = id;
            configTenantToSave.enableAutoPublication = enableAutoPublication;
            configTenantToSave.theme = theme;

            const res = await updateConfigTenant(configTenantToSave);
            if (res.error) {
                toast(`${polyglot.t('error')} : ${res.error}`, {
                    type: toast.TYPE.ERROR,
                });
            } else {
                toast(polyglot.t('configTenantUpdated'), {
                    type: toast.TYPE.SUCCESS,
                });
                onLoadConfigTenant();
            }
        } catch (e) {
            toast(`${polyglot.t('error')} : ${e}`, {
                type: toast.TYPE.ERROR,
            });
        }
    };

    const handleCancel = () => {
        history.push('/data');
    };

    const handleConfigTenantChange = newConfigTenant => {
        setIsFormModified(true);
        setConfigTenant(newConfigTenant);
    };

    return (
        <Box className="container">
            <h1>{polyglot.t('config_tenant')}</h1>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    gap: 1,
                }}
            >
                <h2>{polyglot.t('enableAutoPublication')}</h2>
                <Checkbox
                    checked={enableAutoPublication}
                    onChange={event => {
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
                <h2>{polyglot.t('user_auth')}</h2>
                <Checkbox
                    checked={userAuth?.active || false}
                    onChange={event => {
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
                    onChange={event => {
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
                    onChange={event => {
                        setUserAuth({
                            ...userAuth,
                            password: event.target.value,
                        });
                    }}
                />
            </Box>

            <h2>{polyglot.t('theme')}</h2>
            <Select
                value={theme}
                style={{
                    width: 'min(505px, 100%)',
                }}
                sx={{ mb: 2 }}
                onChange={event => {
                    setTheme(event.target.value);
                }}
            >
                {themes.map(t => (
                    <MenuItem key={t.value} value={t.value}>
                        {t.name[polyglot.currentLocale]} -{' '}
                        {t.description[polyglot.currentLocale]}
                    </MenuItem>
                ))}
            </Select>

            <h2>{polyglot.t('other')}</h2>
            <TextField
                label="Enrichment Batch Size"
                value={enrichmentBatchSize || ''}
                type="number"
                sx={{ mb: 2 }}
                onChange={event => {
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
                        {polyglot.t('cancel')}
                    </CancelButton>
                    <Button
                        variant="contained"
                        className="btn-save"
                        color="primary"
                        onClick={handleSave}
                        startIcon={
                            isFormModified && (
                                <Tooltip title={polyglot.t('form_is_modified')}>
                                    <SaveAs />
                                </Tooltip>
                            )
                        }
                        sx={{
                            animation: isFormModified ? `${shake} 1s ease` : '',
                        }}
                    >
                        {polyglot.t('save')}
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
    p: polyglotPropTypes.isRequired,
    history: PropTypes.object.isRequired,
    onLoadConfigTenant: PropTypes.func.isRequired,
};

export default compose(
    translate,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(ConfigTenantForm);
