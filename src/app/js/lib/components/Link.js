import React from 'react';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import classnames from 'classnames';

import theme from '../../theme';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        link: {
            color: theme.green.primary,
            textDecoration: 'none',
            ':hover': {
                color: theme.green.primary,
                textDecoration: 'underline',
            },
            ':active': {
                textDecoration: 'underline',
                color: theme.orange.primary,
            },
            ':focus': {
                textDecoration: 'underline',
                color: theme.orange.primary,
            },
        },
    },
    'link',
);

const Link = ({ to, href, className, children, routeAware, ...rest }) => {
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
