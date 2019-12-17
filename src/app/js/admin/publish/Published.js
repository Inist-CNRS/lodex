import React from 'react';
import translate from 'redux-polyglot/translate';
import { CardText } from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import Card from '../../lib/components/Card';
import theme from '../../theme';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    text: {
        color: theme.purple.primary,
        fontSize: '1rem',
        textAlign: 'center',
    },
};

const PublishedComponent = ({ p: polyglot }) => (
    <Card className="data-published">
        <CardText style={styles.container}>
            <div style={styles.text}>{polyglot.t('published')}</div>
        </CardText>
        <CardText style={styles.container}>
            <Button
                className="btn-navigate-to-published-data"
                href="/"
                label={polyglot.t('navigate_to_published_data')}
                variant="contained"
                primary
            />
        </CardText>
    </Card>
);

PublishedComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(PublishedComponent);
