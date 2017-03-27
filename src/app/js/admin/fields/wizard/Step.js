import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import { reduxForm } from 'redux-form';
import { Step, StepButton, StepLabel, StepContent } from 'material-ui/Stepper';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { FIELD_FORM_NAME } from '../';

export const StepComponent = ({
    active,
    completed,
    disabled,
    handleSelectStep,
    step,
    last,
    style,
    label,
    children,
    icon,
    p: polyglot,
}) => (
    <Step active={active} completed={completed} disabled={disabled} icon={icon} index={step} last={last} style={style}>
        <StepButton onTouchTap={handleSelectStep}>{polyglot.t(label)}</StepButton>
        <StepContent>
            {children}
        </StepContent>
    </Step>
);

StepComponent.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
    disabled: PropTypes.bool,
    handleSelectStep: PropTypes.func.isRequired,
    last: PropTypes.bool,
    style: PropTypes.object, // eslint-disable-line
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    p: polyglotPropTypes.isRequired,
    step: PropTypes.number.isRequired,
};

StepComponent.defaultProps = {
    active: false,
    canSelectStep: false,
    completed: false,
    disabled: false,
    last: false,
};

export default compose(
    withProps(({ field }) => ({ initialValues: field })),
    withHandlers({
        handleSelectStep: ({ step, onSelectStep }) => () => {
            onSelectStep(step);
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
