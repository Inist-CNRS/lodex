import React from 'react';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { Card, CardHeader } from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import ContributedResourceList from './ContributedResourceList';
import withInitialData from '../withInitialData';
import redirectToDashboardIfNoField from '../../admin/redirectToDashboardIfNoField';

export const ContributedResourcePageComponent = ({ p: polyglot }) => (
    <Card>
        <CardHeader title={<h3>{polyglot.t('contributed_resources')}</h3>} />
        <Divider />
        <ContributedResourceList />
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
