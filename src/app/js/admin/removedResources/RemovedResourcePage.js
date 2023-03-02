import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Card, CardHeader, Divider } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import RemovedResourceList from './RemovedResourceList';
import withInitialData from '../withInitialData';
import redirectToDashboardIfNoField from '../../admin/redirectToDashboardIfNoField';

export const RemovedResourcePageComponent = ({ p: polyglot }) => (
    <Card>
        <CardHeader title={<h3>{polyglot.t('hidden_resources')}</h3>} />
        <Divider />
        <RemovedResourceList />
    </Card>
);

RemovedResourcePageComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default compose(
    redirectToDashboardIfNoField,
    withInitialData,
    translate,
)(RemovedResourcePageComponent);
