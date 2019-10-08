import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import IconButton from 'material-ui/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import theme from '../../theme';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        root: {
            height: '48px !important',
            width: '48px !important',
            padding: '0px !important',
        },
        icon: {
            color: theme.green.primary,
            ':hover': {
                color: theme.purple.primary,
            },
            ':active': {
                color: theme.orange.primary,
            },
        },
    },
    'nav-button',
);

export const NEXT = 'next';
export const PREV = 'previous';
export const NONE = '';

const renderIcon = direction =>
    direction === NEXT ? (
        <FontAwesomeIcon
            className={styles.icon}
            icon={faAngleRight}
            color={theme.green.primary}
            height={36}
        />
    ) : (
        <FontAwesomeIcon
            className={styles.icon}
            icon={faAngleLeft}
            color={theme.green.primary}
            height={36}
        />
    );

const NavButton = ({ p: polyglot, direction, navigate }) => {
    if (!direction) {
        return null;
    }

    const label = polyglot.t(direction);
    const icon = renderIcon(direction);
    const handleNavigate = () => navigate(direction);

    return (
        <IconButton
            className={classnames(`nav-button-${direction}`, styles.root)}
            tooltip={label}
            tooltipPosition="bottom-center"
            onClick={handleNavigate}
        >
            {icon}
        </IconButton>
    );
};

NavButton.propTypes = {
    p: polyglotPropTypes.isRequired,
    direction: PropTypes.oneOf([NEXT, PREV, NONE]),
    navigate: PropTypes.func,
};

NavButton.defaultProps = {
    direction: NONE,
    navigate: () => {},
};

export default compose(translate)(NavButton);
