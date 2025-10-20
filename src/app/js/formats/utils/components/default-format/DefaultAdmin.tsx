// @ts-expect-error TS6133
import React from 'react';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import { Alert } from '@mui/material';
import { translate } from '../../../../i18n/I18NContext';

interface DefaultAdminProps {
    p: unknown;
}

const DefaultAdmin = ({
    p
}: DefaultAdminProps) => {
    return <Alert severity="info">{p.t('format_without_params')}</Alert>;
};

export default translate(DefaultAdmin);
