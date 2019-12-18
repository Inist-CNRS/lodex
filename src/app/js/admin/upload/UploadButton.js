import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import UploadDialog from './UploadDialog';
import { fromUpload } from '../selectors';
import { openUpload, closeUpload } from './';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    button: {
        color: 'white',
        marginLeft: 4,
        marginRight: 4,
    },
};

const UploadButtonComponent = ({
    open,
    label,
    raised,
    handleOpen,
    handleClose,
    p: polyglot,
}) => {
    const actions = [
        <Button key="cancel" secondary onClick={handleClose}>
            {polyglot.t('cancel')}
        </Button>,
    ];

    return (
        <span>
            {raised ? (
                <Button
                    style={styles.button}
                    className="open-upload"
                    variant="raised"
                    primary
                    onClick={handleOpen}
                >
                    {label}
                </Button>
            ) : (
                <Button
                    style={styles.button}
                    className="open-upload"
                    primary
                    onClick={handleOpen}
                >
                    {label}
                </Button>
            )}
            <Dialog
                actions={actions}
                modal={false}
                open={open}
                onRequestClose={handleClose}
                autoScrollBodyContent
            >
                <UploadDialog />
            </Dialog>
        </span>
    );
};

UploadButtonComponent.propTypes = {
    open: PropTypes.bool.isRequired,
    raised: PropTypes.bool,
    label: PropTypes.string.isRequired,
    handleOpen: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

UploadButtonComponent.defaultProps = {
    raised: false,
};

const mapStateToProps = state => ({
    open: fromUpload.isOpen(state),
    saving: fromUpload.isUploadPending(state),
});

const mapDispatchToProps = {
    handleOpen: openUpload,
    handleClose: closeUpload,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(UploadButtonComponent);
