import React from 'react';
import translate from 'redux-polyglot/translate';
import { Button, CardContent, Card } from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../../propTypes';
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
    <Card className="data-published" style={{ marginTop: '0.5rem' }}>
        <CardContent style={styles.container}>
            <div style={styles.text}>{polyglot.t('published')}</div>
        </CardContent>
        <CardContent style={styles.container}>
            <Button
                variant="contained"
                className="btn-navigate-to-published-data"
                href="/"
                label={polyglot.t('navigate_to_published_data')}
                color="primary"
            />
        </CardContent>
    </Card>
);

PublishedComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(PublishedComponent);
