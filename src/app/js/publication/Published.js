import React from 'react';
import translate from 'redux-polyglot/translate';
import { Card, CardText } from 'material-ui/Card';
import { polyglot as polyglotPropTypes } from '../lib/propTypes';

const PublishedComponent = ({ p: polyglot }) => (
    <Card>
        <CardText>
            {polyglot.t('Published')}
        </CardText>
    </Card>
);

PublishedComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(PublishedComponent);

