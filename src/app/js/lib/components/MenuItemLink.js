import React from 'react';
import { MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';

import Link from '../../lib/components/Link';

const styles = {
    link: {
        textDecoration: 'none',
        color: 'unset',
        display: 'block',
        width: '100%',
    },
};

const MenuItemLink = ({ label, link, value, disabled }) => (
    <MenuItem disabled={disabled} value={value}>
        {disabled ? (
            label
        ) : (
            <Link style={styles.link} to={link}>
                {label}
            </Link>
        )}
    </MenuItem>
);

MenuItemLink.propTypes = {
    label: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    value: PropTypes.string,
    disabled: PropTypes.bool,
};

export default MenuItemLink;
