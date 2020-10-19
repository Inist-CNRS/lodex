import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { Dialog, Button } from '@material-ui/core';
import ArchiveIcon from '@material-ui/icons/Archive';

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
        <Button
            variant="text"
            key="cancel"
            color="secondary"
            label={polyglot.t('cancel')}
            onClick={handleClose}
        />,
    ];

    return (
        <span>
            {raised ? (
                <Button
                    variant="contained"
                    style={styles.button}
                    className="open-upload"
                    startIcon={<ArchiveIcon />}
                    label={label}
                    color="primary"
                    onClick={handleOpen}
                />
            ) : (
                <Button
                    variant="text"
                    style={styles.button}
                    className="open-upload"
                    label={label}
                    color="primary"
                    onClick={handleOpen}
                />
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
