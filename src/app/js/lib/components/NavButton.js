import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import IconButton from 'material-ui/IconButton';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';

import theme from '../../theme';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    root: {},
};

export const NEXT = 'next';
export const PREV = 'previous';
export const NONE = '';

const renderIcon = direction =>
    direction === NEXT ? (
        <ChevronRight
            color={theme.green.primary}
            hoverColor={theme.purple.primary}
        />
    ) : (
        <ChevronLeft
            color={theme.green.primary}
            hoverColor={theme.purple.primary}
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
            className={`nav_${direction}`}
            style={styles.root}
            tooltip={label}
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
