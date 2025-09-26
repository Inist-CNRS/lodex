// @ts-expect-error TS6133
import React from 'react';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import { Alert } from '@mui/material';
import { translate } from '../../../../i18n/I18NContext';

// @ts-expect-error TS7031
const DefaultAdmin = ({ p }) => {
    return <Alert severity="info">{p.t('format_without_params')}</Alert>;
};

DefaultAdmin.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(DefaultAdmin);
