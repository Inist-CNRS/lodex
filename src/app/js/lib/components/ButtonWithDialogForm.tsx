import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
// @ts-expect-error TS7016
import withHandlers from 'recompose/withHandlers';
// @ts-expect-error TS7016
import { submit as submitAction } from 'redux-form';
import { IconButton, Button, CircularProgress } from '@mui/material';
import classnames from 'classnames';

import ButtonWithStatus from './ButtonWithStatus';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import ButtonWithDialog from './ButtonWithDialog';
import stylesToClassname from '../../lib/stylesToClassName';
import CancelButton from './CancelButton';
import { translate } from '../../i18n/I18NContext';

const styles = stylesToClassname(
    {
        icon: {
            color: 'var(--primary-main)',
        },
    },
    'dialog-button',
);

export const PureButtonWithDialogForm = ({
    // @ts-expect-error TS7031
    buttonStyle,
    // @ts-expect-error TS7031
    handleClose,
    // @ts-expect-error TS7031
    handleOpen,
    // @ts-expect-error TS7031
    handleSubmit,
    // @ts-expect-error TS7031
    saving,
    // @ts-expect-error TS7031
    open,
    // @ts-expect-error TS7031
    show,
    // @ts-expect-error TS7031
    style,
    // @ts-expect-error TS7031
    icon,
    // @ts-expect-error TS7031
    form,
    // @ts-expect-error TS7031
    className,
    // @ts-expect-error TS7031
    label,
    openButton = icon ? (
        // @ts-expect-error TS2769
        <IconButton
            className={classnames(
                'open',
                'dialog-button',
                className,
                // @ts-expect-error TS2339
                styles.icon,
            )}
            tooltip={label}
            onClick={handleOpen}
            style={{ ...buttonStyle, color: 'inherit' }}
        >
            {saving ? <CircularProgress variant="indeterminate" /> : icon}
        </IconButton>
    ) : (
        <Button
            variant="text"
            className={classnames(className, 'dialog-button')}
            color="primary"
            onClick={handleOpen}
            style={buttonStyle}
        >
            {label}
        </Button>
    ),
    // @ts-expect-error TS7031
    p: polyglot,
}) => {
    if (!show) {
        return null;
    }

    const actions = [
        <CancelButton key="cancel" onClick={handleClose}>
            {polyglot.t('cancel')}
        </CancelButton>,
        <ButtonWithStatus
            raised
            key="save"
            className={classnames(className, 'save')}
            color="primary"
            loading={saving}
            onClick={handleSubmit}
            error={undefined}
            disabled={undefined}
            success={undefined}
            progress={undefined}
            target={undefined}
        >
            {polyglot.t('save')}
        </ButtonWithStatus>,
    ];

    return (
        <ButtonWithDialog
            style={style}
            openButton={openButton}
            actions={actions}
            dialog={form}
            open={open}
            className={className}
            handleClose={handleClose}
            label={label}
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
    handleOpen: PropTypes.func,
    handleSubmit: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    saving: PropTypes.bool.isRequired,
    open: PropTypes.bool,
    show: PropTypes.bool,
    buttonStyle: PropTypes.object,
    style: PropTypes.object,
    form: PropTypes.node.isRequired,
    icon: PropTypes.node,
    label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
    className: PropTypes.string.isRequired,
    openButton: PropTypes.element,
};

const mapDispatchToProps = { submit: submitAction };

export default compose(
    connect(null, mapDispatchToProps),
    withHandlers({
        handleSubmit:
            // @ts-expect-error TS7031


                ({ submit, formName }) =>
                () => {
                    submit(formName);
                },
    }),
    translate,
)(PureButtonWithDialogForm);
