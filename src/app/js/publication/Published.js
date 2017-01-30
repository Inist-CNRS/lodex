import React from 'react';
import translate from 'redux-polyglot/translate';
import { CardText } from 'material-ui/Card';
import { polyglot as polyglotPropTypes } from '../lib/propTypes';
import Card from '../lib/Card';

const PublishedComponent = ({ p: polyglot }) => (
    <Card className="data-published">
        <CardText>
            {polyglot.t('Published')}
        </CardText>
    </Card>
);

PublishedComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(PublishedComponent);

