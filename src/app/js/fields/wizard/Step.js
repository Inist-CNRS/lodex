import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import { reduxForm } from 'redux-form';
import { Step, StepButton, StepContent } from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { FIELD_FORM_NAME } from '../';

export const StepComponent = ({
    id,
    active,
    completed,
    disabled,
    last,
    style,
    icon,
    handleSelectStep,
    index,
    label,
    children,
    p: polyglot,
}) => (
    <Step
        id={id}
        active={active}
        completed={completed}
        disabled={disabled}
        icon={icon}
        index={index}
        last={last}
        style={style}
    >
        <StepButton onClick={handleSelectStep}>{polyglot.t(label)}</StepButton>
        <StepContent>{children}</StepContent>
    </Step>
);

StepComponent.propTypes = {
    id: PropTypes.string,
    // The following are props injected by the MUI Stepper component
    active: PropTypes.bool,
    completed: PropTypes.bool,
    disabled: PropTypes.bool,
    index: PropTypes.number.isRequired,
    last: PropTypes.bool,
    style: PropTypes.object,
    icon: PropTypes.node,

    handleSelectStep: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    p: polyglotPropTypes.isRequired,
};

StepComponent.defaultProps = {
    id: null,
    active: false,
    canSelectStep: false,
    completed: false,
    disabled: false,
    last: false,
    icon: null,
};

export default compose(
    withProps(({ field }) => ({ initialValues: field })),
    withHandlers({
        handleSelectStep: ({ index, onSelectStep }) => () => {
            onSelectStep(index);
        },
    }),
    reduxForm({
        form: FIELD_FORM_NAME,
        enableReinitialize: true,
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true,
    }),
    translate,
)(StepComponent);
