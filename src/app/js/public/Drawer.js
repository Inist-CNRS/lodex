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
        backgroundColor: 'white',
        width: DRAWER_WIDTH,
        overflowY: 'auto',
        top: 0,
        borderRight: '1px solid #E3EAF2',
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
        top: 0,
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
});

const drawerStyleFromProps = ({ animationDuration, status, shift }) => ({
    transition: `transform ${animationDuration}ms`,
    transform:
        status === 'open'
            ? `translateX(${shift}px)`
            : `translateX(-${DRAWER_WIDTH}px)`,
});

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
            css(styles.container),
            css(
                styles[
                    status === 'open' && !disabled
                        ? 'openContainer'
                        : 'closedContainer'
                ],
            ),
        )}
    >
        <div
            className={classnames('drawer', css(styles.drawer), {
                [css(styles.drawerBoxShadow)]: status === 'open' && !disabled,
                [css(styles.drawerDisabled)]: disabled,
            })}
            style={drawerStyleFromProps({ animationDuration, status, shift })}
        >
            {status !== 'closed' && children}
        </div>
        <div
            className={classnames('mask', css(styles.mask), {
                [css(styles.maskOpen)]: status === 'open' && !disabled,
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
