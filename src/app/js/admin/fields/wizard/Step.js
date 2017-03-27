import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import { reduxForm } from 'redux-form';
import { Step, StepLabel, StepContent } from 'material-ui/Stepper';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { FIELD_FORM_NAME } from '../';

export const StepComponent = ({
    active,
    completed,
    disabled,
    index,
    last,
    style,
    label,
    children,
    p: polyglot,
}) => (
    <Step active={active} completed={completed} disabled={disabled} index={index} last={last} style={style}>
        <StepLabel>{polyglot.t(label)}</StepLabel>
        <StepContent>
            {children}
        </StepContent>
    </Step>
);

StepComponent.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
    disabled: PropTypes.bool,
    index: PropTypes.number.isRequired,
    last: PropTypes.bool,
    style: PropTypes.object, // eslint-disable-line
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    p: polyglotPropTypes.isRequired,
};

StepComponent.defaultProps = {
    active: false,
    completed: false,
    disabled: false,
    last: false,
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
