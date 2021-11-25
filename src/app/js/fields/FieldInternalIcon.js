import React from 'react';
import PropTypes from 'prop-types';
import HomeIcon from '@material-ui/icons/Home';
import DescriptionIcon from '@material-ui/icons/Description';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import BarChartIcon from '@material-ui/icons/BarChart';
import SortIcon from '@material-ui/icons/Sort';

const HOME = 'home';
const DOCUMENT = 'document';
const SUBRESSOURCE = 'subRessource';
const CHART = 'chart';
const FACET = 'facet';
const INTERNAL_SCOPE_ICON = [];
INTERNAL_SCOPE_ICON['home'] = <HomeIcon />;
INTERNAL_SCOPE_ICON['document'] = <DescriptionIcon />;
INTERNAL_SCOPE_ICON['subRessource'] = <DescriptionOutlinedIcon />;
INTERNAL_SCOPE_ICON['facet'] = <SortIcon />;
INTERNAL_SCOPE_ICON['chart'] = <BarChartIcon />;

const getIconInternalScope = scope => {
    if (scope) {
        return INTERNAL_SCOPE_ICON[scope];
    }
};

const FieldInternalIcon = ({ scope }) => getIconInternalScope(scope);

FieldInternalIcon.propTypes = {
    scope: PropTypes.oneOf([HOME, DOCUMENT, CHART, SUBRESSOURCE, FACET, '']),
};

export default FieldInternalIcon;
