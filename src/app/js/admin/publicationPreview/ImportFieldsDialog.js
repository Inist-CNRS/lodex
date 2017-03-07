import React, { Component, PropTypes } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    input: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0,
        width: '100%',
        cursor: 'pointer',
    },
};

class ImportFieldsDialogComponent extends Component {
    storeFieldsInputRef = (input) => {
        this.fieldsImportInput = input;
    }

    render() {
        const { onCancel, onFileUpload, p: polyglot } = this.props;

        const actions = [
            <FlatButton
                className="btn-confirm"
                containerElement="label"
                label={polyglot.t('yes')}
                primary
            >
                <input
                    name="file_model"
                    type="file"
                    onChange={onFileUpload}
                    style={styles.input}
                />
            </FlatButton>,
            <FlatButton
                className="btn-cancel"
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
    }
}

ImportFieldsDialogComponent.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onFileUpload: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
)(ImportFieldsDialogComponent);
