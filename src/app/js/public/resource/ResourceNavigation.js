import React, { Fragment } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';

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

const ResourceNavigation = ({ history }) => {
    const location = {
        pathname: '/',
        state: {},
    };

    const navigate = () => history.push(location);

    return (
        <Fragment>
            <div className={classnames(styles.nav, styles.left)}>
                <NavButton direction={PREV} navigate={navigate}></NavButton>
            </div>
            <div className={classnames(styles.nav, styles.right)}>
                <NavButton direction={NEXT} navigate={navigate}></NavButton>
            </div>
        </Fragment>
    );
};

ResourceNavigation.propTypes = {
    history: PropTypes.object,
};

export default compose(withRouter)(ResourceNavigation);
