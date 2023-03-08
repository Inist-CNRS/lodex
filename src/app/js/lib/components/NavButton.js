import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import stylesToClassname from '../../lib/stylesToClassName';
import customTheme from '../../../custom/customTheme';

const styles = stylesToClassname(
    {
        root: {
            height: '48px !important',
            width: '48px !important',
            padding: '0px !important',
        },
        icon: {
            color: customTheme.palette.primary.main,
            ':hover': {
                color: customTheme.palette.info.main,
            },
            ':active': {
                color: customTheme.palette.secondary.main,
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
            color={customTheme.palette.primary.main}
            height={36}
        />
    ) : (
        <FontAwesomeIcon
            className={styles.icon}
            icon={faAngleLeft}
            color={customTheme.palette.primary.main}
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
