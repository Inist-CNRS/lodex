// @ts-expect-error TS6133
import React from 'react';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import classnames from 'classnames';
import PropTypes from 'prop-types';
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

// @ts-expect-error TS7031
const Link = ({ to, href, className, children, routeAware, ...rest }) => {
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

// create PropTypes
Link.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    href: PropTypes.string,
    routeAware: PropTypes.bool,
    to: PropTypes.string,
};

export default Link;
