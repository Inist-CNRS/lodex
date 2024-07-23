import React from 'react';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';

import stylesToClassname from '../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        page: {
            paddingBottom: 80,
        },
    },
    'page',
);

export const AppComponent = ({ children }) => (
    <Container className={styles.page} maxWidth="xl">
        <div className="body">{children}</div>
    </Container>
);

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppComponent;
