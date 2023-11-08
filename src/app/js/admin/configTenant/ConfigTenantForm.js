import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, TextField } from '@mui/material';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

import translate from 'redux-polyglot/translate';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { withRouter } from 'react-router';
import { getConfigTenant, updateConfigTenant } from '../api/configTenant';
import PropTypes from 'prop-types';
import CancelButton from '../../lib/components/CancelButton';
import { toast } from '../../../../common/tools/toast';
import { loadConfigTenant } from '.';

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
    useEffect(() => {
        async function fetchData() {
            const { response } = await getConfigTenant();
            setUserAuth(response.userAuth);
            setEnrichmentBatchSize(response.enrichmentBatchSize);
            setId(response._id);
            setEnableAutoPublication(response.enableAutoPublication);
            delete response.userAuth;
            delete response.enrichmentBatchSize;
            delete response._id;
            delete response.enableAutoPublication;

            const stringified = JSON.stringify(response, null, 2);
            setConfigTenant(stringified);
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
        setConfigTenant(newConfigTenant);
    };

    return (
        <>
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

            <h2>{polyglot.t('other')}</h2>
            <TextField
                label="Enrichment Batch Size"
                value={enrichmentBatchSize || ''}
                sx={{ mb: 2 }}
                onChange={event => {
                    setEnrichmentBatchSize(event.target.value);
                }}
            />
            <AceEditor
                placeholder="Placeholder Text"
                mode={'json'}
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
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 1,
                    mb: 2,
                }}
            >
                <CancelButton sx={{ height: '100%' }} onClick={handleCancel}>
                    {polyglot.t('cancel')}
                </CancelButton>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                >
                    {polyglot.t('save')}
                </Button>
            </Box>
        </>
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
