import React from 'react';
import translate from 'redux-polyglot/translate';
import { CardText } from '@material-ui/core';
import { polyglot as polyglotPropTypes } from '../propTypes';
import Card from '../lib/components/Card';

const NoDatasetComponent = ({ p: polyglot }) => (
    <Card>
        <CardText>{polyglot.t('no_dataset')}</CardText>
    </Card>
);

NoDatasetComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(NoDatasetComponent);
