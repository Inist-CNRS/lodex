import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const ImportFieldsDialogComponent = ({ onCancel, onConfirm, p: polyglot }) => {
    const actions = [
        <FlatButton
            className="btn-cancel"
            label={polyglot.t('yes')}
            primary
            onTouchTap={onConfirm}
        />,
        <FlatButton
            className="btn-confirm"
            label={polyglot.t('no')}
            onTouchTap={onCancel}
        />,
    ];

    return (
        <Dialog
            open
            actions={actions}
        >
            {polyglot.t('confirm_import_fields')}
        </Dialog>
    );
};

ImportFieldsDialogComponent.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
)(ImportFieldsDialogComponent);
