import React from 'react';
import { PropTypes } from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';
import get from 'lodash.get';
import { StyleSheet, css } from 'aphrodite/no-important';
import classnames from 'classnames';

import theme from '../../theme';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = StyleSheet.create({
    link: {
        textDecoration: 'none',
        ':hover': {
            textDecoration: 'none',
        },
        ':focus': {
            textDecoration: 'none',
            color: theme.orange.primary,
        },
        ':visited': {
            textDecoration: 'none',
        },
        ':active': {
            color: theme.orange.primary,
        },
    },
    active: {
        color: theme.orange.primary,
        ':hover': {
            color: theme.orange.primary,
        },
    },
    drawerActive: {
        color: `${theme.purple.primary} !important`,
        ':hover': {
            color: `${theme.purple.primary} !important`,
        },
    },
    menuItem: {
        width: '100%',
        height: 75,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        color: theme.green.primary,
        cursor: 'pointer',
        justifyContent: 'center',
        userSelect: 'none',
        textTransform: 'capitalize',
        ':hover': {
            color: theme.purple.primary,
        },
        ':active': {
            color: theme.orange.primary,
        },
    },
    menuItemIcon: {
        margin: '0 auto',
    },
});

const getIcon = icon => {
    const faIcon = get(icons, icon);
    if (faIcon) {
        return (
            <FontAwesomeIcon
                icon={faIcon}
                className={css(styles.menuItemIcon)}
            />
        );
    }
    return (
        <img
            src={icon}
            className={css(styles.menuItemIcon)}
            width={50}
            height={50}
        />
    );
};

const MenuItem = ({
    config,
    polyglot,
    closeAll,
    hasGraph,
    graphDrawer,
    searchDrawer,
    handleGraphItemClick,
    toggleSearch,
    canBeSearched,
    role,
    logout,
}) => {
    const label = config.label[polyglot.currentLocale];
    const icon = getIcon(config.icon);

    switch (config.role) {
        case 'home':
            return (
                <NavLink
                    to="/"
                    exact
                    className={classnames(
                        'nav-item',
                        css(styles.menuItem),
                        css(styles.link),
                    )}
                    activeClassName={css(styles.active)}
                    onClick={closeAll}
                >
                    {icon}
                    {label}
                </NavLink>
            );
        case 'resources':
            return (
                <NavLink
                    to="/graph"
                    exact
                    className={classnames(
                        'nav-item',
                        css(styles.menuItem),
                        css(styles.link),
                    )}
                    activeClassName={css(styles.active)}
                    onClick={closeAll}
                >
                    {icon}
                    {label}
                </NavLink>
            );
        case 'graphs':
            return (
                hasGraph && (
                    <NavLink
                        to="/graph"
                        onClick={handleGraphItemClick}
                        className={classnames(
                            'nav-item',
                            css(styles.menuItem),
                            css(styles.link),
                            {
                                [css(styles.drawerActive)]:
                                    graphDrawer === 'open',
                            },
                        )}
                        isActive={(location, params) =>
                            get(location, 'url') === '/graph' &&
                            get(params, 'pathname') !== '/graph'
                        }
                        activeClassName={css(styles.active)}
                    >
                        {icon}
                        {label}
                    </NavLink>
                )
            );
        case 'search':
            return (
                canBeSearched && (
                    <div
                        onClick={toggleSearch}
                        className={classnames(
                            'nav-item',
                            css(styles.menuItem),
                            {
                                [css(styles.drawerActive)]:
                                    searchDrawer === 'open',
                            },
                        )}
                    >
                        {icon}
                        {label}
                    </div>
                )
            );
        case 'admin':
            return (
                role === 'admin' && (
                    <a
                        href="/admin"
                        className={classnames('nav-item', css(styles.menuItem))}
                    >
                        {icon}
                        {label}
                    </a>
                )
            );
        case 'sign-in':
            return (
                role === 'not logged' && (
                    <Link
                        to="/login"
                        className={classnames('nav-item', css(styles.menuItem))}
                    >
                        {icon}
                        {label}
                    </Link>
                )
            );
        case 'sign-out':
            return (
                role !== 'not logged' && (
                    <Link
                        to="/login"
                        className={classnames('nav-item', css(styles.menuItem))}
                        onClick={logout}
                    >
                        {icon}
                        {label}
                    </Link>
                )
            );

        case 'custom': {
            const { link } = config;
            if (!link) {
                console.error(
                    `Missing link for custom menuItem: ${JSON.stringify(
                        config,
                    )}`,
                );
                return null;
            }
            if (link.startsWith('http')) {
                return (
                    <a
                        href={link}
                        className={classnames('nav-item', css(styles.menuItem))}
                    >
                        {icon}
                        {label}
                    </a>
                );
            }
            return (
                <NavLink
                    to={link}
                    onClick={closeAll}
                    className={classnames(
                        'nav-item',
                        css(styles.menuItem),
                        css(styles.link),
                    )}
                    activeClassName={css(styles.active)}
                >
                    {icon}
                    {label}
                </NavLink>
            );
        }
        default:
            console.error(
                `Unknow role: ${config.role} menu item: ${JSON.stringify(
                    config,
                )} will be ignored`,
            );
            return null;
    }
};

MenuItem.propTypes = {
    config: PropTypes.shape({
        role: PropTypes.oneOf([
            'home',
            'resources',
            'graphs',
            'search',
            'admin',
            'sign-in',
            'sign-out',
            'custom',
        ]),
        label: PropTypes.shape({
            en: PropTypes.string.isRequired,
            fr: PropTypes.string.isRequired,
        }).isRequired,
        icon: PropTypes.string.isRequired,
    }).isRequired,
    closeAll: PropTypes.func.isRequired,
    graphDrawer: PropTypes.oneOf(['open', 'closing', 'closed']),
    searchDrawer: PropTypes.oneOf(['open', 'closing', 'closed']),
    handleGraphItemClick: PropTypes.func.isRequired,
    toggleSearch: PropTypes.func.isRequired,
    role: PropTypes.oneOf(['admin', 'user', 'not logged']).isRequired,
    logout: PropTypes.func.isRequired,
    canBeSearched: PropTypes.bool.isRequired,
    hasGraph: PropTypes.bool.isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

export default MenuItem;
