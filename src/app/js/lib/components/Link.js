import React from 'react';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import stylesToClassname from '../../lib/stylesToClassName';
import customTheme from '../../../custom/customTheme';

const styles = stylesToClassname(
    {
        link: {
            color: customTheme.palette.primary.main,
            textDecoration: 'none',
            ':hover': {
                color: customTheme.palette.primary.main,
                textDecoration: 'underline',
            },
            ':active': {
                textDecoration: 'underline',
                color: customTheme.palette.secondary.main,
            },
            ':focus': {
                textDecoration: 'underline',
                color: customTheme.palette.secondary.main,
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

// create PropTypes
Link.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    href: PropTypes.string,
    routeAware: PropTypes.bool,
    to: PropTypes.string,
};

export default Link;
