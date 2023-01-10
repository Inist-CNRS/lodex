import React from 'react';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import classnames from 'classnames';

import colorsTheme from '../../../custom/colorsTheme';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        link: {
            color: colorsTheme.green.primary,
            textDecoration: 'none',
            ':hover': {
                color: colorsTheme.green.primary,
                textDecoration: 'underline',
            },
            ':active': {
                textDecoration: 'underline',
                color: colorsTheme.orange.primary,
            },
            ':focus': {
                textDecoration: 'underline',
                color: colorsTheme.orange.primary,
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
