import React from 'react';
import { PropTypes } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyleSheet, css } from 'aphrodite/no-important';

const styles = StyleSheet.create({
    menuItem: {
        width: '100%',
        height: 75,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        color: '#7DBD42',
        cursor: 'pointer',
        justifyContent: 'center',
        userSelect: 'none',
        textTransform: 'capitalize',
        ':hover': {
            color: '#B22F90',
            fontWeight: 'bold',
        },
        ':active': {
            color: '#F48022',
        },
    },
    menuItemIcon: {
        margin: '0 auto',
    },
});

export const MenuItem = ({ label, icon, ...props }) => (
    <div {...props} className={css(styles.menuItem)}>
        <FontAwesomeIcon icon={icon} className={css(styles.menuItemIcon)} />
        {label}
    </div>
);

MenuItem.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
};

export default MenuItem;
