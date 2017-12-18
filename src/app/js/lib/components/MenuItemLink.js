import React from 'react';
import { Link } from 'react-router';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';

const styles = {
    link: {
        textDecoration: 'none',
        color: 'unset',
        display: 'block',
        width: '100%',
    },
};

const MenuItemLink = ({ label, link, value, disabled }) => (
    <MenuItem
        disabled={disabled}
        value={value}
        primaryText={
            disabled ? (
                label
            ) : (
                <Link style={styles.link} to={link}>
                    {label}
                </Link>
            )
        }
    />
);

MenuItemLink.propTypes = {
    label: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    value: PropTypes.string,
    disabled: PropTypes.bool,
};

export default MenuItemLink;
