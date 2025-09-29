// @ts-expect-error TS6133
import React from 'react';
import { CardContent, Card } from '@mui/material';
import { polyglot as polyglotPropTypes } from '../propTypes';
import { translate } from '../i18n/I18NContext';

// @ts-expect-error TS7031
const NoDatasetComponent = ({ p: polyglot }) => (
    <Card sx={{ marginTop: '0.5rem' }}>
        <CardContent>{polyglot.t('no_dataset')}</CardContent>
    </Card>
);

NoDatasetComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(NoDatasetComponent);
