import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import stylesToClassname from '../lib/stylesToClassName';

export const ANIMATION_DURATION = 300; // ms

export const DRAWER_OPEN = 'open';
export const DRAWER_CLOSING = 'closing';
export const DRAWER_CLOSED = 'closed';

export const useDrawer = (
    initialPosition = DRAWER_CLOSED,
    animationDuration = ANIMATION_DURATION,
    closeSearch = undefined,
) => {
    if (initialPosition !== DRAWER_OPEN && initialPosition !== DRAWER_CLOSED) {
        throw new Error(
            `Error in useDrawer hook: the initial position should be ${DRAWER_OPEN} or ${DRAWER_CLOSED}`,
        );
    }

    const [position, setPosition] = useState(initialPosition);

    const open = () => {
        setPosition(DRAWER_OPEN);
    };

    const close = () => {
        if (position !== DRAWER_OPEN) {
            return;
        }
        if (closeSearch) {
            closeSearch();
        }

        setPosition(DRAWER_CLOSING);
        setTimeout(() => {
            setPosition(DRAWER_CLOSED);
        }, animationDuration);
    };

    const toggle = () => {
        if (position == DRAWER_OPEN) {
            close();
            return;
        }
        open();
    };

    return [position, toggle, close, open];
};

const styles = stylesToClassname(
    {
        drawer: {
            zIndex: 1001,
            position: 'fixed',
            top: '100vh',
            left: '0px',
            width: '100vw',
            height: '100vh',
            marginBottom: '100px',
            padding: '15px',
            overflowY: 'auto',
            backgroundColor: 'white',
            transition: `top 300ms ease-in-out`,
        },
        drawerOpen: {
            borderTop: '1px solid #E3EAF2',
            boxShadow: '0 2px 1rem #777',
            height: 'calc(100vh - 8vh - 80px)', // Screen height - position from top - navbar height
            top: '8vh',
        },
        drawerClosing: {
            height: 'calc(100vh - 8vh - 80px)', // Screen height - position from top - navbar height
            top: '100vh',
        },
        drawerClosed: {
            height: '0vh',
            top: '100vh',
        },
        drawerDisabled: {
            filter: 'brightness(0.98)',
        },
        mask: {
            zIndex: 1000,
            position: 'fixed',
            bottom: '0px',
            left: '0px',
            height: '0vh',
            width: '0vw',
            backgroundColor: 'black',
            opacity: '0',
            pointerEvents: 'none',
            transition: `opacity ${ANIMATION_DURATION}ms ease-in-out`,
        },
        maskOpen: {
            height: '100vh',
            width: '100vw',
            opacity: '.3',
            pointerEvents: 'auto',
            cursor: 'pointer',
            ':hover': {
                opacity: '.4',
            },
        },
    },
    'drawer',
);

const preventScroll = () => {
    document.body.style.overflow = 'hidden';
    document.body.style['-webkit-overflow-scrolling'] = 'touch';
};

const removePreventScroll = () => {
    document.body.style.overflow = '';
    document.body.style['-webkit-overflow-scrolling'] = '';
};

const Drawer = ({ children, status, onClose, disabled }) => {
    useEffect(() => {
        if (status === 'open') {
            preventScroll();
        } else {
            removePreventScroll();
        }
    }, [status]);

    return (
        <>
            <div
                className={classnames('drawer', styles.drawer, {
                    [styles.drawerOpen]: status === DRAWER_OPEN && !disabled,
                    [styles.drawerClosed]: status === DRAWER_CLOSED,
                    [styles.drawerDisabled]: disabled,
                })}
            >
                {status !== DRAWER_CLOSED &&
                    React.cloneElement(children, { closeDrawer: onClose })}
            </div>
            <div
                className={classnames('mask', styles.mask, {
                    [styles.maskOpen]: status === DRAWER_OPEN && !disabled,
                })}
                onClick={onClose}
            />
        </>
    );
};

Drawer.propTypes = {
    children: PropTypes.node.isRequired,
    status: PropTypes.oneOf([DRAWER_OPEN, DRAWER_CLOSING, DRAWER_CLOSED])
        .isRequired,
    onClose: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

Drawer.defaultProps = {
    disabled: false,
};

export default Drawer;
