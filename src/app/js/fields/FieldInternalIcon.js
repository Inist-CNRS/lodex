import React from 'react';
import PropTypes from 'prop-types';
import HomeIcon from '@material-ui/icons/Home';
import DescriptionIcon from '@material-ui/icons/Description';
import BarChartIcon from '@material-ui/icons/BarChart';

const HOME = 'home';
const DOCUMENT = 'document';
const CHART = 'chart';
const INTERNAL_STATE_ICON = [];
INTERNAL_STATE_ICON['home'] = <HomeIcon />;
INTERNAL_STATE_ICON['document'] = <DescriptionIcon />;
INTERNAL_STATE_ICON['chart'] = <BarChartIcon />;

const getIconInternalState = state => {
    if (!!state) {
        return INTERNAL_STATE_ICON[state];
    }
};

const FieldInternalIcon = ({ state }) => (getIconInternalState(state));

FieldInternalIcon.propTypes = {
    state: PropTypes.oneOf([HOME, DOCUMENT, CHART, '']),
};

export default FieldInternalIcon;
