import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    modal: {
        transform: 'translate(0px, 8px)',
    },
};

export const PureButtonWithDialog = ({
    handleClose,
    handleOpen,
    open,
    show,
    dialog,
    className,
    label,
    icon,
    p: polyglot,
    actions = [
        <FlatButton
            key="cancel"
            label={polyglot.t('close')}
            onClick={handleClose}
        />,
    ],
    openButton = (
        <FlatButton
            primary
            className={className}
            label={label}
            icon={icon}
            onClick={handleOpen}
        />
    ),
}) => {
    if (!show) {
        return null;
    }

    return (
        <>
            {openButton}
            <Dialog
                title={label}
                actions={actions}
                modal={false}
                open={open}
                onRequestClose={handleClose}
                autoScrollBodyContent
                contentStyle={styles.modal}
                bodyClassName="dialog-body"
                contentClassName="dialog-content"
                actionsContainerClassName="dialog-actions"
            >
                {dialog}
            </Dialog>
        </>
    );
};

PureButtonWithDialog.propTypes = {
    handleClose: PropTypes.func,
    handleOpen: PropTypes.func,
    p: polyglotPropTypes.isRequired,
    open: PropTypes.bool,
    show: PropTypes.bool,
    dialog: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.node,
    className: PropTypes.string,
    actions: PropTypes.arrayOf(PropTypes.node),
    openButton: PropTypes.node,
};

PureButtonWithDialog.defaultProps = {
    show: true,
    open: false,
    className: null,
};

export default translate(PureButtonWithDialog);
