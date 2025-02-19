import React from 'react';
import { CardContent, Card } from '@mui/material';
import { polyglot as polyglotPropTypes } from '../propTypes';
import { translate } from '../i18n/I18NContext';

const NoDatasetComponent = ({ p: polyglot }) => (
    <Card sx={{ marginTop: '0.5rem' }}>
        <CardContent>{polyglot.t('no_dataset')}</CardContent>
    </Card>
);

NoDatasetComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(NoDatasetComponent);
