import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Card, CardHeader } from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import RemovedResourceList from './RemovedResourceList';
import withInitialData from '../withInitialData';

export const RemovedResourcePageComponent = ({ p: polyglot }) => (
    <Card>
        <CardHeader title={<h3>{polyglot.t('removed_resources')}</h3>} />
        <Divider />
        <RemovedResourceList />
    </Card>
);

RemovedResourcePageComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default compose(
    withInitialData,
    translate,
)(RemovedResourcePageComponent);
