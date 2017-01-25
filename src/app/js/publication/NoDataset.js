import React from 'react';
import translate from 'redux-polyglot/translate';
import { Card, CardText } from 'material-ui/Card';
import { polyglot as polyglotPropTypes } from '../lib/propTypes';

const NoDatasetComponent = ({ p: polyglot }) => (
    <Card>
        <CardText>
            {polyglot.t('NoDataset')}
        </CardText>
    </Card>
);

NoDatasetComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(NoDatasetComponent);

