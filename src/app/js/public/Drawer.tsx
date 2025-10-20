import React, {
    useCallback,
    useEffect,
    useState,
    type ReactElement,
} from 'react';
import classnames from 'classnames';

import stylesToClassname from '../lib/stylesToClassName';
import { useDispatch, useSelector } from 'react-redux';
import { fromSearch } from './selectors';
import { triggerSearch } from './search/reducer';

export const ANIMATION_DURATION = 300; // ms

export const DRAWER_OPEN = 'open';
export const DRAWER_CLOSING = 'closing';
export const DRAWER_CLOSED = 'closed';

export const useDrawer = (
    initialPosition = DRAWER_CLOSED,
    animationDuration = ANIMATION_DURATION,
) => {
    if (initialPosition !== DRAWER_OPEN && initialPosition !== DRAWER_CLOSED) {
        throw new Error(
            `Error in useDrawer hook: the initial position should be ${DRAWER_OPEN} or ${DRAWER_CLOSED}`,
        );
    }

    const dispatch = useDispatch();
    const visitedFilter = useSelector(fromSearch.getVisitedFilter);
    const annotationsFilter = useSelector(fromSearch.getAnnotationsFilter);

    useEffect(() => {}, [dispatch, visitedFilter, annotationsFilter]);

    const [position, setPosition] = useState(initialPosition);

    const open = useCallback(() => {
        setPosition(DRAWER_OPEN);

        if (visitedFilter || annotationsFilter) {
            dispatch(triggerSearch());
        }
    }, [dispatch, visitedFilter, annotationsFilter]);

    const close = () => {
        if (position !== DRAWER_OPEN) {
            return;
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
            zIndex: 1100,
            position: 'fixed',
            top: '100vh',
            left: '0px',
            width: '100vw',
            height: '100vh',
            marginBottom: '100px',
            padding: '15px 0 15px 0',
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
            zIndex: 1050,
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
    // @ts-expect-error TS7015
    document.body.style['-webkit-overflow-scrolling'] = 'touch';
};

const removePreventScroll = () => {
    document.body.style.overflow = '';
    // @ts-expect-error TS7015
    document.body.style['-webkit-overflow-scrolling'] = '';
};

interface DrawerProps {
    children: ReactElement;
    status: unknown | unknown | unknown;
    onClose(...args: unknown[]): unknown;
    disabled?: boolean;
}

const Drawer = ({ children, status, onClose, disabled }: DrawerProps) => {
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
                // @ts-expect-error TS2339
                className={classnames('drawer', styles.drawer, {
                    // @ts-expect-error TS2339
                    [styles.drawerOpen]: status === DRAWER_OPEN && !disabled,
                    // @ts-expect-error TS2339
                    [styles.drawerClosed]: status === DRAWER_CLOSED,
                    // @ts-expect-error TS2339
                    [styles.drawerDisabled]: disabled,
                })}
            >
                {status !== DRAWER_CLOSED &&
                    React.cloneElement(children, { closeDrawer: onClose })}
            </div>
            <div
                // @ts-expect-error TS2339
                className={classnames('mask', styles.mask, {
                    // @ts-expect-error TS2339
                    [styles.maskOpen]: status === DRAWER_OPEN && !disabled,
                })}
                onClick={onClose}
            />
        </>
    );
};

Drawer.defaultProps = {
    disabled: false,
};

export default Drawer;
