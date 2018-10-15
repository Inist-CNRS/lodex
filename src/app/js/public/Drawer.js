import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { StyleSheet, css } from 'aphrodite/no-important';

const DRAWER_WIDTH = 440; // px
const ANIMATION_DURATION = 300; // ms

const styles = StyleSheet.create({
    container: {
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        zIndex: 10000, // navbar is z-index 1000
    },
    closedContainer: {
        pointerEvents: 'none',
    },
    openContainer: {
        pointerEvents: 'auto',
    },
    drawer: {
        position: 'relative',
        height: '100vh',
        transition: `transform ${ANIMATION_DURATION}ms`,
        transitionTimingFunction: 'ease-in-out',
        backgroundColor: '#f8f8f8',
        width: DRAWER_WIDTH,
        overflowX: 'scroll',
        boxShadow: '0 2px 1rem #777',
    },
    closed: {
        transform: `translateX(-${DRAWER_WIDTH}px)`,
    },
    open: {
        transform: 'translate(0)',
    },
    openButton: {
        position: 'absolute',
        top: 'calc(50vh - 50px)',
        height: 100,
        width: 100,
        left: -80,
        backgroundColor: 'lightgray',
        borderRadius: '50%',
        cursor: 'pointer',
        pointerEvents: 'auto',
        transition: 'transform 100ms',
        transitionTimingFunction: 'ease-in-out',
        ':hover': {
            transform: 'translateX(5px)',
            filter: 'brightness(0.8)',
        },
        ':after': {
            content: '"🔍"',
            position: 'absolute',
            top: 'calc(50% - 10px)',
            right: 5,
        },
    },
    mask: {
        position: 'absolute',
        top: 0,
        left: DRAWER_WIDTH,
        height: '100vh',
        width: `calc(100vw - ${DRAWER_WIDTH}px)`,
    },
});

class Drawer extends Component {
    state = {
        open: false,
        showChildren: false,
    };

    openDrawer = () => {
        const { open } = this.state;

        if (open) {
            return;
        }

        this.setState({ open: true, showChildren: true });
    };

    closeDrawer = () => {
        const { open } = this.state;

        if (!open) {
            return;
        }

        this.setState({ open: false }, () =>
            setTimeout(() => {
                this.setState({ showChildren: false });
            }, ANIMATION_DURATION),
        );
    };

    renderClosed = () => (
        <div className={css(styles.openButton)} onClick={this.openDrawer} />
    );

    render() {
        const { open, showChildren } = this.state;
        const { children } = this.props;

        return (
            <div
                className={classnames(
                    'drawer-container',
                    css(styles.container),
                    css(styles[open ? 'openContainer' : 'closedContainer']),
                )}
            >
                {!open && this.renderClosed()}
                <div
                    className={classnames(
                        'drawer',
                        css(styles.drawer),
                        css(styles[open ? 'open' : 'closed']),
                    )}
                >
                    {showChildren &&
                        children({
                            closeDrawer: this.closeDrawer,
                            openDrawer: this.openDrawer,
                        })}
                </div>
                {open && (
                    <div
                        className={classnames('mask', css(styles.mask))}
                        onClick={this.closeDrawer}
                    />
                )}
            </div>
        );
    }
}

Drawer.propTypes = {
    children: PropTypes.func.isRequired,
};

export default Drawer;
