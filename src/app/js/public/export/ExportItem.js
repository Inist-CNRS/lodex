import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import { ListItem } from 'material-ui/List';
import FileDownloadIcon from '@material-ui/icons/FileDownload';

import { polyglot as polyglotPropTypes } from '../../propTypes';

export const ExportItemComponent = ({ type, p: polyglot, handleClick }) => (
    <ListItem
        key={type}
        className={classnames('btn-export', type)}
        primaryText={polyglot.t('export', { type: polyglot.t(type) })}
        leftIcon={<FileDownloadIcon />}
        onClick={handleClick}
    />
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
