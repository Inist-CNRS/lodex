import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import MenuItem from 'material-ui/MenuItem';

import { polyglot as polyglotPropTypes } from '../propTypes';

export const ExportMenuItemComponent = ({ type, p: polyglot, handleClick }) => (
    <MenuItem
        key={type}
        className="btn-export"
        primaryText={polyglot.t('export', { type })}
        value={type}
        onClick={handleClick}
    />
);

ExportMenuItemComponent.propTypes = {
    handleClick: PropTypes.func.isRequired,
    iconStyle: PropTypes.object, // eslint-disable-line
    p: polyglotPropTypes.isRequired,
    type: PropTypes.string.isRequired,
};

ExportMenuItemComponent.defaultProps = {
    iconStyle: null,
};

export default compose(
    withHandlers({
        handleClick: ({ onClick, type }) => () => onClick(type),
    }),
    translate,
)(ExportMenuItemComponent);
