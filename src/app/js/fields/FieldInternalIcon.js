import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../propTypes';
import HomeIcon from '@material-ui/icons/Home';
import MainResourceIcon from '@material-ui/icons/InsertDriveFile';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import FilterAtIcon from './FilterAt';
import { Tooltip } from '@material-ui/core';

const INTERNAL_SCOPE_ICONS = [];
INTERNAL_SCOPE_ICONS['home'] = <HomeIcon />;
INTERNAL_SCOPE_ICONS['document'] = <MainResourceIcon />;
INTERNAL_SCOPE_ICONS['subRessource'] = <FileCopyIcon />;
INTERNAL_SCOPE_ICONS['facet'] = <FilterAtIcon />;
INTERNAL_SCOPE_ICONS['chart'] = <EqualizerIcon />;

const getIconInternalScope = (scope, polyglot) => {
    if (scope) {
        return (
            <Tooltip title={polyglot.t(`${scope}_tooltip`)}>
                {INTERNAL_SCOPE_ICONS[scope]}
            </Tooltip>
        );
    }
};

const FieldInternalIcon = ({ scope, p: polyglot }) =>
    getIconInternalScope(scope, polyglot);

FieldInternalIcon.propTypes = {
    scope: PropTypes.oneOf(Object.keys(INTERNAL_SCOPE_ICONS)),
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldInternalIcon);
