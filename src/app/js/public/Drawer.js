import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import memoize from 'lodash.memoize';

import stylesToClassname from '../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        drawer: {
            zIndex: 1001,
            position: 'absolute',
            top: '100vh',
            left: '0px',
            width: '100vw',
            height: '100vh',
            overflowY: 'auto',
            backgroundColor: 'white',
            borderTop: '1px solid #E3EAF2',
        },
        drawerOpen: {
            boxShadow: '0 2px 1rem #777',
            top: '10vh',
        },
        drawerClosing: {
            top: '100vh',
        },
        drawerClosed: {
            top: '100vh',
        },
        drawerDisabled: {
            filter: 'brightness(0.98)',
        },
        mask: {
            zIndex: 1000,
            position: 'absolute',
            bottom: '0px',
            left: '0px',
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

const buildDrawerAnimationStyles = memoize(({ animationDuration }) => ({
    transition: `top ${animationDuration}ms`,
    transitionTimingFunction: 'ease-in-out',
}));

const Drawer = ({ children, status, animationDuration, onClose, disabled }) => {
    const drawerStyle = buildDrawerAnimationStyles({
        animationDuration,
    });

    return (
        <>
            <div
                className={classnames('drawer', styles.drawer, {
                    [styles.drawerOpen]: status === 'open' && !disabled,
                    [styles.drawerClosed]: status === 'closed',
                    [styles.drawerDisabled]: disabled,
                })}
                style={drawerStyle}
            >
                {status !== 'closed' && children}
            </div>
            <div
                className={classnames('mask', styles.mask, {
                    [styles.maskOpen]: status === 'open' && !disabled,
                })}
                onClick={onClose}
            />
        </>
    );
};

Drawer.propTypes = {
    children: PropTypes.node.isRequired,
    status: PropTypes.oneOf(['open', 'closing', 'closed']).isRequired,
    onClose: PropTypes.func.isRequired,
    animationDuration: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
};

Drawer.defaultProps = {
    disabled: false,
};

export default Drawer;
