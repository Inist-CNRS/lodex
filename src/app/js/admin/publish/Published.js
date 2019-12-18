import React from 'react';
import translate from 'redux-polyglot/translate';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
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
        <CardContent style={styles.container}>
            <div style={styles.text}>{polyglot.t('published')}</div>
        </CardContent>
        <CardActions style={styles.container}>
            <Button
                className="btn-navigate-to-published-data"
                href="/"
                variant="contained"
                primary
            >
                {polyglot.t('navigate_to_published_data')}
            </Button>
        </CardActions>
    </Card>
);

PublishedComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(PublishedComponent);
