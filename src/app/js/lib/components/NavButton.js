import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import withHandlers from 'recompose/withHandlers';

import { isLongText, getShortText } from '../../lib/longTexts';

const styles = {
    root: {},
    next: {},
    prev: {},
};

const NEXT = 'next';
const PREV = 'prev';
const NONE = '';

const renderIcon = direction => {
    if (direction === NEXT) {
        return <ChevronRight style={styles.next} />;
    } else {
        return <ChevronLeft style={styles.left} />;
    }
};

const NavButton = ({ direction, label, navigate }) => {
    if (!direction) {
        return null;
    }

    const transformedLabel = isLongText(label) ? getShortText(label) : label;
    const icon = renderIcon(direction);
    const handleNavigate = () => navigate(direction);

    return (
        <FlatButton
            className={`nav_${direction}`}
            style={styles.root}
            labelPosition="before"
            onClick={handleNavigate}
            label={transformedLabel}
            icon={icon}
        />
    );
};

NavButton.propTypes = {
    direction: PropTypes.oneOf([NEXT, PREV, NONE]).isRequired,
    label: PropTypes.string.isRequired,
    navigate: PropTypes.func.isRequired,
};

NavButton.defaultProps = {
    direction: NONE,
    label: '',
    navigate: () => {},
};

export default withHandlers()(NavButton);
