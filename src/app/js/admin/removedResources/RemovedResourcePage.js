import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import Card from '@material-ui/core/Card';
import CardHead from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import RemovedResourceList from './RemovedResourceList';
import withInitialData from '../withInitialData';
import redirectToDashboardIfNoField from '../../admin/redirectToDashboardIfNoField';

export const RemovedResourcePageComponent = ({ p: polyglot }) => (
    <Card>
        <CardHead title={<h3>{polyglot.t('removed_resources')}</h3>} />
        <CardContent>
            <RemovedResourceList />
        </CardContent>
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
