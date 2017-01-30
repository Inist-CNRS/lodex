import React, { PropTypes } from 'react';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';

import { CardText } from 'material-ui/Card';
import { polyglot as polyglotPropTypes } from '../lib/propTypes';
import Card from '../lib/Card';

const PublishedComponent = ({ p: polyglot, ...props }) => (
    <Card className={classnames('data-published', props.className)}>
        <CardText>
            {polyglot.t('Published')}
        </CardText>
    </Card>
);

PublishedComponent.propTypes = {
    className: PropTypes.string,
    p: polyglotPropTypes.isRequired,
};

PublishedComponent.defaultProps = {
    className: null,
};

export default translate(PublishedComponent);

