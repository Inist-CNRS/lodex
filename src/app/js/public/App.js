import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

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
    <div className={classnames(styles.page)}>
        <div className="body">{children}</div>
    </div>
);

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppComponent;
