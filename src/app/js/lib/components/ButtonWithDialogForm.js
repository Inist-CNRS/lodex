import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { submit as submitAction } from 'redux-form';
import { IconButton, Button, CircularProgress } from '@material-ui/core';
import classnames from 'classnames';

import ButtonWithStatus from './ButtonWithStatus';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import ButtonWithDialog from './ButtonWithDialog';
import theme from '../../theme';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        icon: {
            color: theme.green.primary,
        },
    },
    'dialog-button',
);

export const PureButtonWithDialogForm = ({
    buttonStyle,
    handleClose,
    handleOpen,
    handleSubmit,
    saving,
    open,
    show,
    style,
    icon,
    form,
    className,
    label,
    openButton = icon ? (
        <IconButton
            className={classnames(
                'open',
                'dialog-button',
                className,
                styles.icon,
            )}
            tooltip={label}
            onClick={handleOpen}
            style={buttonStyle}
            iconStyle={{ color: 'inherit' }}
        >
            {saving ? <CircularProgress variant="indeterminate" /> : icon}
        </IconButton>
    ) : (
        <Button
            variant="text"
            className={classnames(className, 'dialog-button')}
            label={label}
            color="primary"
            onClick={handleOpen}
            style={buttonStyle}
        />
    ),
    p: polyglot,
}) => {
    if (!show) {
        return null;
    }
    const actions = [
        <ButtonWithStatus
            raised
            key="save"
            className={classnames(className, 'save')}
            label={polyglot.t('save')}
            color="primary"
            loading={saving}
            onClick={handleSubmit}
        />,
        <Button
            variant="text"
            color="secondary"
            key="cancel"
            label={polyglot.t('cancel')}
            onClick={handleClose}
        />,
    ];

    return (
        <ButtonWithDialog
            style={style}
            openButton={openButton}
            actions={actions}
            dialog={form}
            open={open}
            label={label}
            className={className}
            handleClose={handleClose}
        />
    );
};

PureButtonWithDialogForm.defaultProps = {
    icon: null,
    show: true,
    open: false,
};

PureButtonWithDialogForm.propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleOpen: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    saving: PropTypes.bool.isRequired,
    open: PropTypes.bool,
    show: PropTypes.bool,
    buttonStyle: PropTypes.object,
    style: PropTypes.object,
    form: PropTypes.node.isRequired,
    icon: PropTypes.node,
    label: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    openButton: PropTypes.element.isRequired,
};

const mapDispatchToProps = { submit: submitAction };

export default compose(
    connect(null, mapDispatchToProps),
    withHandlers({
        handleSubmit: ({ submit, formName }) => () => {
            submit(formName);
        },
    }),
    translate,
)(PureButtonWithDialogForm);
