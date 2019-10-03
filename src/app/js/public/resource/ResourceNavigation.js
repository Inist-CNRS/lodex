import React, { Fragment } from 'react';
import classnames from 'classnames';

import stylesToClassname from '../../lib/stylesToClassName';
import NavButton from '../../lib/components/NavButton';

const styles = stylesToClassname(
    {
        nav: {
            position: 'fixed',
            top: '50%',
        },
        left: {
            left: '0',
        },
        right: {
            right: '0',
        },
    },
    'resource-navigation',
);

const ResourceNavigation = () => {
    return (
        <Fragment>
            <div className={classnames(styles.nav, styles.left)}>
                <NavButton direction="prev" label="Prev"></NavButton>
            </div>
            <div className={classnames(styles.nav, styles.right)}>
                <NavButton direction="next" label="Next"></NavButton>
            </div>
        </Fragment>
    );
};

export default ResourceNavigation;
