import React from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
// @ts-expect-error TS7016
import withHandlers from 'recompose/withHandlers';
import { translate } from '../../i18n/I18NContext';
import { MenuItem } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../propTypes';

// @ts-expect-error TS7031
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
        handleClick:
            // @ts-expect-error TS7031


                ({ onClick, uri, exportID }) =>
                () =>
                    onClick({ uri, exportID }),
    }),
    translate,
)(ExportMenuItem);
