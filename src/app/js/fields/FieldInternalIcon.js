import React from 'react';
import PropTypes from 'prop-types';
import HomeIcon from '@material-ui/icons/Home';
import MainResourceIcon from '@material-ui/icons/InsertDriveFile';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import FilterAtIcon from './FilterAt';

const INTERNAL_SCOPE_ICONS = [];
INTERNAL_SCOPE_ICONS['home'] = <HomeIcon />;
INTERNAL_SCOPE_ICONS['document'] = <MainResourceIcon />;
INTERNAL_SCOPE_ICONS['subRessource'] = <FileCopyIcon />;
INTERNAL_SCOPE_ICONS['facet'] = <FilterAtIcon />;
INTERNAL_SCOPE_ICONS['chart'] = <EqualizerIcon />;

const getIconInternalScope = scope => {
    if (scope) {
        return INTERNAL_SCOPE_ICONS[scope];
    }
};

const FieldInternalIcon = ({ scope }) => getIconInternalScope(scope);

FieldInternalIcon.propTypes = {
    scope: PropTypes.oneOf(Object.keys(INTERNAL_SCOPE_ICONS)),
};

export default FieldInternalIcon;
