import React from 'react';
import RouterLink from 'react-router-dom/Link';
import NavLink from 'react-router-dom/NavLink';
import classnames from 'classnames';
import { StyleSheet, css } from 'aphrodite/no-important';
import theme from '../../theme';

const styles = StyleSheet.create({
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
});

const Link = ({ to, href, className, children, routeAware, ...rest }) => {
    const classname = classnames(className, 'link', css(styles.link));
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
