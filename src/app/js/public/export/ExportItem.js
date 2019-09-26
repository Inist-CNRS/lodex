import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { CloudDownloadOutlined as FileDownloadIcon } from '@material-ui/icons';

import { polyglot as polyglotPropTypes } from '../../propTypes';

export const ExportItemComponent = ({ type, p: polyglot, handleClick }) => (
    <ListItem
        button
        key={type}
        className={classnames('btn-export', type)}
        onClick={handleClick}
    >
        <ListItemIcon>
            <FileDownloadIcon />
        </ListItemIcon>
        <ListItemText
            primary={polyglot.t('export', { type: polyglot.t(type) })}
        />
    </ListItem>
);

ExportItemComponent.propTypes = {
    handleClick: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    type: PropTypes.string.isRequired,
};

export default compose(
    withHandlers({
        handleClick: ({ onClick, type, uri }) => () => onClick({ type, uri }),
    }),
    translate,
)(ExportItemComponent);
