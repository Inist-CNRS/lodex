import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import memoize from 'lodash.memoize';

import stylesToClassname from '../lib/stylesToClassName';

const DRAWER_HEIGHT = 440; // px
const NAVBAR_HEIGHT = 110; // px

const styles = stylesToClassname(
    {
        container: {
            position: 'fixed',
            bottom: NAVBAR_HEIGHT,
            left: 0,
            height: '100vh',
            width: '100vw',
            zIndex: 1000, // navbar is z-index 10000
        },
        closedContainer: {
            pointerEvents: 'none',
        },
        openContainer: {
            pointerEvents: 'auto',
        },
        drawer: {
            zIndex: 1001,
            position: 'absolute',
            width: '100vw',
            transitionTimingFunction: 'ease-in-out',
            backgroundColor: 'white',
            height: DRAWER_HEIGHT,
            overflowY: 'auto',
            bottom: NAVBAR_HEIGHT,
            borderTop: '1px solid #E3EAF2',
        },
        drawerBoxShadow: {
            boxShadow: '0 2px 1rem #777',
        },
        drawerDisabled: {
            filter: 'brightness(0.98)',
        },
        mask: {
            position: 'absolute',
            zIndex: 1000,
            bottom: 0,
            left: 0,
            height: '100vh',
            width: `100vw`,
            backgroundColor: 'black',
            opacity: '0',
            pointerEvents: 'none',
            transition: 'opacity 300ms ease-in-out',
        },
        maskOpen: {
            opacity: '.3',
            pointerEvents: 'auto',
        },
    },
    'drawer',
);

const drawerStyleFromProps = memoize(
    ({ animationDuration, status, shift }) => ({
        transition: `transform ${animationDuration}ms`,
        transform:
            status === 'open'
                ? `translateY(-${shift}px)`
                : `translateY(${DRAWER_HEIGHT}px)`,
    }),
);

const Drawer = ({
    children,
    status,
    animationDuration,
    onClose,
    shift,
    disabled,
}) => (
    <div
        className={classnames(
            'drawer-container',
            styles.container,
            styles[
                status === 'open' && !disabled
                    ? 'openContainer'
                    : 'closedContainer'
            ],
        )}
    >
        <div
            className={classnames('drawer', styles.drawer, {
                [styles.drawerBoxShadow]: status === 'open' && !disabled,
                [styles.drawerDisabled]: disabled,
            })}
            style={drawerStyleFromProps({ animationDuration, status, shift })}
        >
            {status !== 'closed' && children}
        </div>
        <div
            className={classnames('mask', styles.mask, {
                [styles.maskOpen]: status === 'open' && !disabled,
            })}
            onClick={onClose}
        />
    </div>
);

Drawer.propTypes = {
    children: PropTypes.node.isRequired,
    status: PropTypes.oneOf(['open', 'closing', 'closed']).isRequired,
    onClose: PropTypes.func.isRequired,
    animationDuration: PropTypes.number.isRequired,
    shift: PropTypes.number,
    disabled: PropTypes.bool,
};

Drawer.defaultProps = {
    shift: 0,
    disabled: false,
};

export default Drawer;
