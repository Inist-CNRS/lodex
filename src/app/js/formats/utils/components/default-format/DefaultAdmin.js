import React from 'react';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import { Alert } from '@mui/material';

const DefaultAdmin = ({ p }) => {
    return <Alert severity="info">{p.t('format_without_params')}</Alert>;
};

DefaultAdmin.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(DefaultAdmin);
