import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

import translate from 'redux-polyglot/translate';
import { compose } from 'recompose';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { withRouter } from 'react-router';
import { getConfigTenant, updateConfigTenant } from '../api/configTenant';
import PropTypes from 'prop-types';
import CancelButton from '../../lib/components/CancelButton';
import { toast } from '../../../../common/tools/toast';

export const ConfigTenantForm = ({ p: polyglot, history }) => {
    const [configTenant, setConfigTenant] = useState({});
    useEffect(() => {
        async function fetchData() {
            const { response } = await getConfigTenant();
            setConfigTenant(response);
        }
        fetchData();
    }, []);

    const handleSave = async () => {
        const res = await updateConfigTenant(configTenant);
        if (res.error) {
            toast(`${polyglot.t('error')} : ${res.error}`, {
                type: toast.TYPE.ERROR,
            });
        } else {
            toast(polyglot.t('configTenantUpdated'), {
                type: toast.TYPE.SUCCESS,
            });
        }
    };

    const handleCancel = () => {
        history.push('/data');
    };

    return (
        <>
            <h1>{polyglot.t('config_tenant')}</h1>
            <AceEditor
                mode="json"
                theme="monokai"
                onChange={newConfig => setConfigTenant(JSON.parse(newConfig))}
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
                value={JSON.stringify(configTenant, null, 2)}
                width="100%"
            />
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 1,
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

ConfigTenantForm.propTypes = {
    p: polyglotPropTypes.isRequired,
    history: PropTypes.object.isRequired,
};

export default compose(translate, withRouter)(ConfigTenantForm);
