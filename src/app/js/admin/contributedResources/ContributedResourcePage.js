import React from 'react';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import ContributedResourceList from './ContributedResourceList';
import withInitialData from '../withInitialData';
import redirectToDashboardIfNoField from '../../admin/redirectToDashboardIfNoField';

export const ContributedResourcePageComponent = ({ p: polyglot }) => (
    <Card>
        <CardHeader title={<h3>{polyglot.t('contributed_resources')}</h3>} />
        <CardContent>
            <ContributedResourceList />
        </CardContent>
    </Card>
);

ContributedResourcePageComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default compose(
    redirectToDashboardIfNoField,
    withInitialData,
    translate,
)(ContributedResourcePageComponent);
