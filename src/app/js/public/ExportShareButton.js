import React from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

import { fromExport } from './selectors';
import ButtonWithDialog from '../lib/components/ButtonWithDialog';
import { openExport, closeExport } from './export';
import ExportShare from './ExportShare';

const mapStateToProps = (state, { p, uri, style }) => ({
    show: true,
    open: fromExport.isOpen(state),
    dialog: <ExportShare uri={uri} />,
    label: p.t('share_export'),
    className: 'share-export',
    style,
});

const mapDispatchToProps = {
    handleOpen: openExport,
    handleClose: closeExport,
};

export default compose(translate, connect(mapStateToProps, mapDispatchToProps))(
    ButtonWithDialog,
);
