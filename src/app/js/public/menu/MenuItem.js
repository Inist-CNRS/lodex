import React from 'react';
import { PropTypes } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';
import get from 'lodash.get';
import classnames from 'classnames';
import { Link, NavLink } from 'react-router-dom';

import theme from '../../theme';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import ExportShareMenuItem from '../ExportShareMenuItem';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
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
            width: 'auto',
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
            margin: '0',
        },
    },
    'menu-item',
);

const getIcon = icon => {
    const faIcon = get(icons, icon);
    if (faIcon) {
        return (
            <FontAwesomeIcon icon={faIcon} className={styles.menuItemIcon} />
        );
    }
    return (
        <img
            src={icon}
            className={styles.menuItemIcon}
            width={50}
            height={50}
        />
    );
};

const MenuItem = ({
    config,
    polyglot,
    hasGraph,
    graphDrawer,
    searchDrawer,
    advancedDrawer,
    canBeSearched,
    role,
    onClick,
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
                        styles.menuItem,
                        styles.link,
                    )}
                    activeClassName={styles.active}
                    onClick={onClick(config.role)}
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
                        onClick={onClick(config.role, true)}
                        className={classnames(
                            'nav-item',
                            styles.menuItem,
                            styles.link,
                            {
                                [styles.drawerActive]: graphDrawer === 'open',
                            },
                        )}
                        isActive={(location, params) =>
                            get(location, 'url') === '/graph' &&
                            get(params, 'pathname') !== '/graph'
                        }
                        activeClassName={styles.active}
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
                        onClick={onClick(config.role)}
                        className={classnames('nav-item', styles.menuItem, {
                            [styles.drawerActive]: searchDrawer === 'open',
                        })}
                    >
                        {icon}
                        {label}
                    </div>
                )
            );
        case 'advanced':
            return (
                <div
                    onClick={onClick(config.role)}
                    className={classnames('nav-item', styles.menuItem, {
                        [styles.drawerActive]: advancedDrawer === 'open',
                    })}
                >
                    {icon}
                    {label}
                </div>
            );
        case 'admin':
            return (
                role === 'admin' && (
                    <a
                        href="/admin"
                        className={classnames('nav-item', styles.menuItem)}
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
                        className={classnames('nav-item', styles.menuItem)}
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
                        className={classnames('nav-item', styles.menuItem)}
                        onClick={onClick(config.role)}
                    >
                        {icon}
                        {label}
                    </Link>
                )
            );

        case 'share_export': {
            return (
                <ExportShareMenuItem
                    renderOpenButton={({ handleOpen, open }) => (
                        <div
                            className={classnames('nav-item', styles.menuItem, {
                                [styles.drawerActive]: open,
                            })}
                            onClick={handleOpen}
                        >
                            {icon}
                            {label}
                        </div>
                    )}
                />
            );
        }

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
                        className={classnames('nav-item', styles.menuItem)}
                    >
                        {icon}
                        {label}
                    </a>
                );
            }
            return (
                <NavLink
                    to={link}
                    onClick={onClick(config.role)}
                    className={classnames(
                        'nav-item',
                        styles.menuItem,
                        styles.link,
                    )}
                    activeClassName={styles.active}
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
            'share_export',
        ]),
        label: PropTypes.shape({
            en: PropTypes.string.isRequired,
            fr: PropTypes.string.isRequired,
        }).isRequired,
        icon: PropTypes.string.isRequired,
        link: PropTypes.shape({
            startsWith: PropTypes.func.isRequired,
        }),
    }).isRequired,
    onClick: PropTypes.func.isRequired,
    graphDrawer: PropTypes.oneOf(['open', 'closing', 'closed']),
    searchDrawer: PropTypes.oneOf(['open', 'closing', 'closed']),
    advancedDrawer: PropTypes.oneOf(['open', 'closing', 'closed']),
    role: PropTypes.oneOf(['admin', 'user', 'not logged']).isRequired,
    canBeSearched: PropTypes.bool.isRequired,
    hasGraph: PropTypes.bool.isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

export default MenuItem;
