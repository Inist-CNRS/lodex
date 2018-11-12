import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { connect } from 'react-redux';

import { polyglot as polyglotPropTypes } from '../propTypes';
import ButtonWithDialog from '../lib/components/ButtonWithDialog';
import { fromExport } from './selectors';
import { openExport, closeExport } from './export';
import ExportShare from './ExportShare';

export const PureExportShareMenuItem = ({
    handleClose,
    handleOpen,
    open,
    renderOpenButton,
    p,
}) => (
    <ButtonWithDialog
        openButton={renderOpenButton({ handleOpen, open })}
        dialog={<ExportShare />}
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
)(PureExportShareMenuItem);
