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

const renderIcon = direction =>
    direction === NEXT ? (
        <ChevronRight style={styles.next} />
    ) : (
        <ChevronLeft style={styles.prev} />
    );

const NavButton = ({ direction, label, navigate }) => {
    if (!direction) {
        return null;
    }

    const transformedLabel = isLongText(label) ? getShortText(label) : label;
    const labelPosition = direction === NEXT ? 'before' : 'after';
    const icon = renderIcon(direction);
    const handleNavigate = () => navigate(direction);

    return (
        <FlatButton
            className={`nav_${direction}`}
            style={styles.root}
            label={transformedLabel}
            icon={icon}
            labelPosition={labelPosition}
            onClick={handleNavigate}
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
