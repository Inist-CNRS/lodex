import React from 'react';
import PropTypes from 'prop-types';

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
    <div className="body">
        <div className={styles.page}>{children}</div>
    </div>
);

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppComponent;
