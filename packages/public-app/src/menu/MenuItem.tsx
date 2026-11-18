import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import get from 'lodash/get';
import { lazyComponent } from '@lodex/frontend-common/utils/lazyComponent';
import classnames from 'classnames';
import { Link, NavLink } from 'react-router-dom';

import stylesToClassname from '@lodex/frontend-common/utils/stylesToClassName';
import { ADMIN_ROLE, extractTenantFromUrl } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { ErrorBoundary } from '../ErrorBoundary';
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

const ImageIcon = ({ src }: { src: string }) => (
    <img
        src={src}
        // @ts-expect-error TS2339
        className={styles.menuItemIcon}
        width={50}
        height={50}
    />
);

// The whole icon set is needed since icons are configured by name: keep it out of the main bundle.
// index.js (and not the package root, resolved to index.es.js) so that the named imports
// used elsewhere stay tree-shaken in the main bundle while the full set gets its own chunk.
const MenuFontAwesomeIcon = lazyComponent(
    async () => {
        const icons = await import(
            '@fortawesome/free-solid-svg-icons/index.js'
        );
        return {
            default: ({ name }: { name: string }) => {
                const faIcon = get(icons, name);
                // unknown icon name: rendered as an image, as before the lazy loading
                return faIcon ? (
                    <FontAwesomeIcon
                        icon={faIcon}
                        // @ts-expect-error TS2339
                        className={styles.menuItemIcon}
                    />
                ) : (
                    <ImageIcon src={name} />
                );
            },
        };
    },
    { fallback: null },
);

// @ts-expect-error TS7006
const getIcon = (icon) => {
    // Font Awesome icon names (faHome), otherwise an image url
    if (/^fa[A-Z0-9]\w*$/.test(icon)) {
        // a failed icon chunk must not take down the whole menu
        return (
            <ErrorBoundary fallback={null}>
                <MenuFontAwesomeIcon name={icon} />
            </ErrorBoundary>
        );
    }
    return <ImageIcon src={icon} />;
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
