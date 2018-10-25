import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { StyleSheet, css } from 'aphrodite/no-important';

const DRAWER_WIDTH = 440; // px

const styles = StyleSheet.create({
    container: {
        position: 'fixed',
        top: 0,
        left: 110,
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
        position: 'relative',
        height: '100vh',
        transitionTimingFunction: 'ease-in-out',
        backgroundColor: '#f8f8f8',
        width: DRAWER_WIDTH,
        overflowY: 'auto',
    },
    closed: {
        transform: `translateX(-${DRAWER_WIDTH}px)`,
    },
    closing: {
        transform: `translateX(-${DRAWER_WIDTH}px)`,
        boxShadow: '0 2px 1rem #777',
    },
    open: {
        transform: 'translate(0)',
        boxShadow: '0 2px 1rem #777',
    },
    mask: {
        position: 'absolute',
        zIndex: 1000,
        top: 0,
        left: 0,
        height: '100vh',
        width: `100vw`,
    },
});

const Drawer = ({ children, status, animationDuration, onClose }) => (
    <div
        className={classnames(
            'drawer-container',
            css(styles.container),
            css(
                styles[status === 'open' ? 'openContainer' : 'closedContainer'],
            ),
        )}
    >
        <div
            className={classnames(
                'drawer',
                css(styles.drawer),
                css(styles[status]),
            )}
            style={{
                transition: `transform ${animationDuration}ms`,
            }}
        >
            {status !== 'closed' && children}
        </div>
        {status === 'open' && (
            <div
                className={classnames('mask', css(styles.mask))}
                onClick={onClose}
            />
        )}
    </div>
);

Drawer.propTypes = {
    children: PropTypes.node.isRequired,
    status: PropTypes.oneOf(['open', 'closing', 'closed']).isRequired,
    onClose: PropTypes.func.isRequired,
    animationDuration: PropTypes.number.isRequired,
};

export default Drawer;
