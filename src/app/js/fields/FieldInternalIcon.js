import React from 'react';
import PropTypes from 'prop-types';
import HomeIcon from '@material-ui/icons/Home';
import DescriptionIcon from '@material-ui/icons/Description';
import BarChartIcon from '@material-ui/icons/BarChart';

const HOME = 'home';
const DOCUMENT = 'document';
const CHART = 'chart';
const INTERNAL_SCOPE_ICON = [];
INTERNAL_SCOPE_ICON['home'] = <HomeIcon />;
INTERNAL_SCOPE_ICON['document'] = <DescriptionIcon />;
INTERNAL_SCOPE_ICON['chart'] = <BarChartIcon />;

const getIconInternalScope = scope => {
    if (!!scope) {
        return INTERNAL_SCOPE_ICON[scope];
    }
};

const FieldInternalIcon = ({ scope }) => (getIconInternalScope(scope));

FieldInternalIcon.propTypes = {
    scope: PropTypes.oneOf([HOME, DOCUMENT, CHART, '']),
};

export default FieldInternalIcon;
