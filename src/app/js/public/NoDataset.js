import React from 'react';
import translate from 'redux-polyglot/translate';
import { CardContent, Card } from '@mui/material';
import { polyglot as polyglotPropTypes } from '../propTypes';

const NoDatasetComponent = ({ p: polyglot }) => (
    <Card sx={{ marginTop: '0.5rem' }}>
        <CardContent>{polyglot.t('no_dataset')}</CardContent>
    </Card>
);

NoDatasetComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(NoDatasetComponent);
