import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';
import get from 'lodash/get';
import classnames from 'classnames';
import { Link, NavLink } from 'react-router-dom';

import stylesToClassname from '../../lib/stylesToClassName';
import {
    ADMIN_ROLE,
    extractTenantFromUrl,
} from '../../../../common/tools/tenantTools';
import { useTranslate } from '../../i18n/I18NContext';
import type { ChangeEvent } from 'react';

const styles = stylesToClassname(
    {
        link: {
            textDecoration: 'none',
            ':hover': {
                textDecoration: 'none',
            },
            ':focus': {
                textDecoration: 'none',
            },
            ':visited': {
                textDecoration: 'none',
            },
            ':active': {
                color: 'var(--secondary-main)',
            },
        },
        active: {
            color: 'var(--secondary-main)',
            ':hover': {
                color: 'var(--secondary-main)',
            },
        },
        menuItem: {
            maxWidth: '90px',
            height: '75px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'var(--primary-main)',
            cursor: 'pointer',
            userSelect: 'none',
            textTransform: 'capitalize',
            ':hover': {
                color: 'var(--info-main)',
            },
            ':active': {
                color: 'var(--secondary-main)',
            },
        },
        menuItemIcon: {
            margin: '0',
            height: '34px',
        },
    },
    'menu-item',
);

// @ts-expect-error TS7006
const getIcon = (icon) => {
    const faIcon = get(icons, icon);
    if (faIcon) {
        return (
            // @ts-expect-error TS2339
            <FontAwesomeIcon icon={faIcon} className={styles.menuItemIcon} />
        );
    }
    return (
        <img
            src={icon}
            // @ts-expect-error TS2339
            className={styles.menuItemIcon}
            width={50}
            height={50}
        />
    );
};

type Role = 'admin' | 'user' | 'not logged';

export type ConfigRole =
    | 'home'
    | 'resources'
    | 'advanced'
    | 'graphs'
    | 'search'
    | 'admin'
    | 'sign-in'
    | 'sign-out'
    | 'custom'
    | 'advanced';

interface MenuItemProps {
    config: {
        role?: ConfigRole;
        label: {
            en: string;
            fr: string;
        };
        icon: string;
        link?: string;
        isExternal?: boolean;
    };
    onClick(
        value: ConfigRole,
        suppressEvent?: boolean,
    ): (event: ChangeEvent<any>) => void;
    graphDrawer?: 'open' | 'closing' | 'closed';
    searchDrawer?: 'open' | 'closing' | 'closed';
    advancedDrawer?: 'open' | 'closing' | 'closed';
    role: Role;
    canBeSearched: boolean;
    hasGraph: boolean;
}

const MenuItem = ({
    config,
    hasGraph,
    graphDrawer,
    searchDrawer,
    advancedDrawer,
    canBeSearched,
    role,
    onClick,
}: MenuItemProps) => {
    const { locale } = useTranslate();
    const label = config.label[locale];
    const icon = getIcon(config.icon);

    switch (config.role) {
        case 'home':
            return (
                <NavLink
                    to="/"
                    exact
                    className={classnames(
                        'nav-item',
                        // @ts-expect-error TS2339
                        styles.menuItem,
                        // @ts-expect-error TS2339
                        styles.link,
                    )}
                    // @ts-expect-error TS2339
                    activeClassName={styles.active}
                    onClick={onClick(config.role)}
                    isActive={(match) => {
                        if (
                            !match ||
                            graphDrawer === 'open' ||
                            searchDrawer === 'open' ||
                            advancedDrawer === 'open'
                        ) {
                            return false;
                        }
                        return true;
                    }}
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
                            // @ts-expect-error TS2339
                            styles.menuItem,
                            // @ts-expect-error TS2339
                            styles.link,
                            {
                                // @ts-expect-error TS2339
                                [styles.active]: graphDrawer === 'open',
                            },
                        )}
                        isActive={(location, params) =>
                            get(location, 'url') === '/graph' &&
                            get(params, 'pathname') !== '/graph'
                        }
                        // @ts-expect-error TS2339
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
                    <NavLink
                        to="/search"
                        onClick={onClick(config.role, true)}
                        className={classnames(
                            'nav-item',
                            // @ts-expect-error TS2339
                            styles.menuItem,
                            // @ts-expect-error TS2339
                            styles.link,
                            {
                                // @ts-expect-error TS2339
                                [styles.active]: searchDrawer === 'open',
                            },
                        )}
                        isActive={(location, params) =>
                            get(location, 'url') === '/search' &&
                            get(params, 'pathname') !== '/search'
                        }
                        // @ts-expect-error TS2339
                        activeClassName={styles.active}
                    >
                        {icon}
                        {label}
                    </NavLink>
                )
            );
        case 'advanced':
            return (
                <NavLink
                    to="/advanced"
                    onClick={onClick(config.role, true)}
                    className={classnames(
                        'nav-item',
                        // @ts-expect-error TS2339
                        styles.menuItem,
                        // @ts-expect-error TS2339
                        styles.link,
                        {
                            // @ts-expect-error TS2339
                            [styles.active]: advancedDrawer === 'open',
                        },
                    )}
                >
                    {icon}
                    {label}
                </NavLink>
            );
        case 'admin':
            return (
                role === ADMIN_ROLE && (
                    <a
                        href={`/instance/${extractTenantFromUrl(
                            window.location.href,
                        )}/admin`}
                        className={classnames(
                            'nav-item',
                            // @ts-expect-error TS2339
                            styles.menuItem,
                            // @ts-expect-error TS2339
                            styles.link,
                        )}
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
                        // @ts-expect-error TS2339
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
                        className={classnames(
                            'nav-item',
                            // @ts-expect-error TS2339
                            styles.menuItem,
                            // @ts-expect-error TS2339
                            styles.link,
                        )}
                        onClick={onClick(config.role)}
                    >
                        {icon}
                        {label}
                    </Link>
                )
            );
        case 'custom': {
            const { link, isExternal } = config;
            if (!link) {
                console.error(
                    `Missing link for custom menuItem: ${JSON.stringify(
                        config,
                    )}`,
                );
                return null;
            }
            if (link.startsWith('http') || isExternal) {
                return (
                    <a
                        href={link}
                        // @ts-expect-error TS2339
                        className={classnames('nav-item', styles.menuItem)}
                    >
                        {icon}
                        {label}
                    </a>
                );
            }

            // if link contain .html, it's a static page. Use href instead of to with react-router default route
            if (link.indexOf('.html') !== -1) {
                const tenant = sessionStorage.getItem('lodex-tenant');
                return (
                    <a
                        href={`/instance/${tenant}/${link}`}
                        // @ts-expect-error TS2339
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
                        // @ts-expect-error TS2339
                        styles.menuItem,
                        // @ts-expect-error TS2339
                        styles.link,
                    )}
                    // @ts-expect-error TS2339
                    activeClassName={styles.active}
                >
                    {icon}
                    {label}
                </NavLink>
            );
        }
        default:
            console.error(
                `Unknown role: ${config.role}. Menu item: ${JSON.stringify(
                    config,
                )} will be ignored.`,
            );
            return null;
    }
};

export default MenuItem;
