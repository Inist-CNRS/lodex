import React, { Fragment } from 'react';
import classnames from 'classnames';

import stylesToClassname from '../../lib/stylesToClassName';
import NavButton, { NEXT, PREV } from '../../lib/components/NavButton';

const styles = stylesToClassname(
    {
        nav: {
            position: 'fixed',
            top: '50%',
        },
        left: {
            left: '0',
            '@media (min-width: 992px)': {
                marginLeft: '10px',
            },
        },
        right: {
            right: '0',
            '@media (min-width: 992px)': {
                marginRight: '10px',
            },
        },
    },
    'resource-navigation',
);

const ResourceNavigation = () => {
    return (
        <Fragment>
            <div className={classnames(styles.nav, styles.left)}>
                <NavButton direction={PREV}></NavButton>
            </div>
            <div className={classnames(styles.nav, styles.right)}>
                <NavButton direction={NEXT}></NavButton>
            </div>
        </Fragment>
    );
};

export default ResourceNavigation;
