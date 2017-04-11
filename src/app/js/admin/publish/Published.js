import React from 'react';
import translate from 'redux-polyglot/translate';
import { CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { cyan500 } from 'material-ui/styles/colors';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import Card from '../../lib/Card';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    text: {
        color: cyan500,
        fontSize: '1rem',
        textAlign: 'center',
    },
};

const PublishedComponent = ({ p: polyglot }) => (
    <Card className="data-published">
        <CardText style={styles.container}>
            <div style={styles.text}>
                {polyglot.t('published')}
            </div>
        </CardText>
        <CardText style={styles.container}>
            <RaisedButton
                href="/"
                label={polyglot.t('navigate_to_published_data')}
                primary
            />
        </CardText>
    </Card>
);

PublishedComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(PublishedComponent);

