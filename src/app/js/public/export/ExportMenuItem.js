import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import MenuItem from '@material-ui/core/MenuItem';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const ExportMenuItem = ({ type, p: polyglot, handleClick }) => (
    <MenuItem onClick={handleClick}>{polyglot.t(type)}</MenuItem>
);

ExportMenuItem.propTypes = {
    handleClick: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    type: PropTypes.string.isRequired,
};

export default compose(
    withHandlers({
        handleClick: ({ onClick, type, uri }) => () => onClick({ type, uri }),
    }),
    translate,
)(ExportMenuItem);
