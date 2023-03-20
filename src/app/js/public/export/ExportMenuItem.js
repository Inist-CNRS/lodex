import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import { MenuItem } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const ExportMenuItem = ({ label, p: polyglot, handleClick }) => (
    <MenuItem onClick={handleClick}>{polyglot.t(label)}</MenuItem>
);

ExportMenuItem.propTypes = {
    handleClick: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    label: PropTypes.string.isRequired,
};

export default compose(
    withHandlers({
        handleClick: ({ onClick, uri, exportID }) => () =>
            onClick({ uri, exportID }),
    }),
    translate,
)(ExportMenuItem);
