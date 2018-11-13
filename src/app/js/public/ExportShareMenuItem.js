import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import withRouter from 'react-router/withRouter';

import { polyglot as polyglotPropTypes } from '../propTypes';
import ButtonWithDialog from '../lib/components/ButtonWithDialog';
import { fromExport } from './selectors';
import { openExport, closeExport } from './export';
import ExportShare from './ExportShare';

const getUri = location =>
    location.pathname.match(/\/uid:\//) || location.pathname.match(/\/ark:\//)
        ? location.pathname
        : null;

export const PureExportShareMenuItem = ({
    handleClose,
    handleOpen,
    open,
    renderOpenButton,
    p,
    location,
}) => (
    <ButtonWithDialog
        openButton={renderOpenButton({ handleOpen, open })}
        dialog={<ExportShare uri={getUri(location)} />}
        open={open}
        label={p.t('share_export')}
        handleClose={handleClose}
    />
);

PureExportShareMenuItem.defaultProps = {
    icon: null,
    open: false,
};

PureExportShareMenuItem.propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleOpen: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    open: PropTypes.bool,
    renderOpenButton: PropTypes.func.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string,
    }).isRequired,
};

const mapStateToProps = state => ({
    open: fromExport.isOpen(state),
});

const mapDispatchToProps = {
    handleOpen: openExport,
    handleClose: closeExport,
};

export default compose(
    translate,
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    withRouter,
)(PureExportShareMenuItem);
