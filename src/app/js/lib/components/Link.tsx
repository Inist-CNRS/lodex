// @ts-expect-error TS6133
import React, { type CSSProperties, type ReactNode } from 'react';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import classnames from 'classnames';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        link: {
            color: 'var(--primary-main)',
            textDecoration: 'none',
            ':hover': {
                color: 'var(--primary-main)',
                textDecoration: 'underline',
            },
            ':active': {
                textDecoration: 'underline',
                color: 'var(--secondary-main)',
            },
            ':focus': {
                textDecoration: 'underline',
                color: 'var(--secondary-main)',
            },
        },
    },
    'link',
);

type LinkProps = {
    children?: ReactNode;
    className?: string;
    activeClassName?: string;
    href?: string;
    routeAware?: boolean;
    to?: string | null;
    onClick?: () => void;
    target?: string;
    rel?: string;
    style?: CSSProperties;
};

const Link = ({
    to,
    href,
    className,
    children,
    routeAware,
    ...rest
}: LinkProps) => {
    // @ts-expect-error TS2339
    const classname = classnames(className, 'link', styles.link);
    if (routeAware && to) {
        return (
            <NavLink {...rest} className={classname} to={to}>
                {children}
            </NavLink>
        );
    }
    if (to) {
        return (
            <RouterLink {...rest} className={classname} to={to}>
                {children}
            </RouterLink>
        );
    }

    return (
        <a {...rest} href={href} className={classname}>
            {children}
        </a>
    );
};

export default Link;
