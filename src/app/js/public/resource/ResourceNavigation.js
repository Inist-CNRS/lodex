import React, { Fragment, useEffect } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';

import stylesToClassname from '../../lib/stylesToClassName';
import NavButton, { NEXT, PREV } from '../../lib/components/NavButton';
import useSwiper, { SWIPE_LEFT, SWIPE_RIGHT } from '../../lib/hooks/useSwiper';

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

const buildLocationFromResource = resource =>
    resource
        ? {
              pathname: `/${resource.uri}`,
              state: {},
          }
        : {};

const ResourceNavigation = ({ history, prevResource, nextResource }) => {
    const prevLocation = buildLocationFromResource(prevResource);
    const nextLocation = buildLocationFromResource(nextResource);

    const navigate = location => history.push(location);

    const direction = useSwiper();

    useEffect(() => {
        switch (direction) {
            case SWIPE_LEFT:
                if (prevLocation) {
                    navigate(prevLocation);
                }
                return;
            case SWIPE_RIGHT:
                if (nextLocation) {
                    navigate(nextLocation);
                }
                return;
        }
    }, [direction]);

    return (
        <Fragment>
            {prevResource && (
                <div className={classnames(styles.nav, styles.left)}>
                    <NavButton
                        direction={PREV}
                        navigate={() => navigate(prevLocation)}
                    />
                </div>
            )}
            {nextResource && (
                <div className={classnames(styles.nav, styles.right)}>
                    <NavButton
                        direction={NEXT}
                        navigate={() => navigate(nextLocation)}
                    />
                </div>
            )}
        </Fragment>
    );
};

ResourceNavigation.propTypes = {
    history: PropTypes.object.isRequired,
    prevResource: PropTypes.object,
    nextResource: PropTypes.object,
};

ResourceNavigation.defaultProps = {
    prevResource: null,
    nextResource: null,
};

export default compose(withRouter)(ResourceNavigation);
