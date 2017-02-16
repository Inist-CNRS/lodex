import React from 'react';
import translate from 'redux-polyglot/translate';
import { CardText } from 'material-ui/Card';
import { polyglot as polyglotPropTypes } from '../propTypes';
import Card from '../lib/Card';

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

