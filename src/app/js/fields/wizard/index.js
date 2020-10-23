import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import {
    Stepper,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
} from '@material-ui/core';

import {
    editField as editFieldAction,
    saveField as saveFieldAction,
} from '../';

import { field as fieldPropTypes } from '../../propTypes';
import { fromFields } from '../../sharedSelectors';
import StepValue from './StepValue';
import StepUri from './StepUri';
import StepTransforms from './StepTransforms';
import StepIdentity from './StepIdentity';
import StepDisplay from './StepDisplay';
import StepSearch from './StepSearch';
import StepSemantics from './StepSemantics';
import FieldExcerpt from '../../admin/preview/field/FieldExcerpt';
import Actions from './Actions';

const styles = {
    container: {
        display: 'flex',
        paddingBottom: '1rem',
    },
    form: {
        borderRight: '1px solid rgb(224, 224, 224)',
        marginRight: '1rem',
        paddingRight: '1rem',
        flexGrow: 1,
        maxHeight: '55vh',
        overflowY: 'auto',
    },
    column: {
        minWidth: '10rem',
        maxWidth: '10rem',
    },
    title: {
        display: 'flex',
    },
    titleLabel: {},
};

class FieldEditionWizardComponent extends Component {
    static propTypes = {
        editField: PropTypes.func.isRequired,
        field: fieldPropTypes,
        fields: PropTypes.arrayOf(fieldPropTypes),
        saveField: PropTypes.func.isRequired,
    };

    static defaultProps = {
        field: null,
        fields: null,
        editedField: null,
    };

    constructor(props) {
        super(props);

        this.state = { step: 0 };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (
            !nextProps.field ||
            !this.props.field ||
            nextProps.field.name !== this.props.field.name
        ) {
            this.setState({ step: 0 });
        }
    }

    handleNextStep = () => {
        this.setState({ step: this.state.step + 1 });
    };

    handlePreviousStep = () => {
        this.setState({ step: this.state.step - 1 });
    };

    handleSelectStep = step => {
        this.setState({ step });
    };

    handleCancel = () => {
        this.props.editField(undefined);
    };

    handleSave = () => {
        this.props.saveField();
    };

    render() {
        const { field, fields } = this.props;

        const { step } = this.state;

        if (!field) return null;

        let steps = [];

        if (field && field.name !== 'uri') {
            steps = [
                <StepIdentity
                    key={'identity'}
                    id="step-identity"
                    index={0}
                    active={step === 0}
                    field={field}
                    fields={fields}
                    onSelectStep={this.handleSelectStep}
                />,
                <StepValue
                    key={'value'}
                    index={1}
                    active={step === 1}
                    field={field}
                    fields={fields}
                    onSelectStep={this.handleSelectStep}
                />,
                <StepTransforms
                    key={'transformations'}
                    index={2}
                    active={step === 2}
                    field={field}
                    fields={fields}
                    onSelectStep={this.handleSelectStep}
                />,
                <StepSemantics
                    key={'semantics'}
                    index={3}
                    active={step === 3}
                    field={field}
                    fields={fields}
                    onSelectStep={this.handleSelectStep}
                />,
                <StepDisplay
                    key={'display'}
                    index={4}
                    active={step === 4}
                    field={field}
                    fields={fields}
                    onSelectStep={this.handleSelectStep}
                />,
                <StepSearch
                    key={'search'}
                    index={5}
                    active={step === 5}
                    field={field}
                    fields={fields}
                    onSelectStep={this.handleSelectStep}
                />,
            ];
        }

        const actions = (
            <Actions
                field={field}
                step={step}
                stepsCount={steps.length}
                onPreviousStep={this.handlePreviousStep}
                onNextStep={this.handleNextStep}
                onCancel={this.handleCancel}
                onSave={this.handleSave}
            />
        );

        const title = (
            <div style={styles.title}>
                <span>{field ? field.label : ''}</span>
                {field && field.name !== 'uri'}
            </div>
        );

        return (
            <Dialog open={!!field} scroll="body" className="wizard">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {field && (
                        <div style={styles.container}>
                            <div id="field_form" style={styles.form}>
                                {field.name !== 'uri' ? (
                                    <Stepper
                                        nonLinear
                                        activeStep={step}
                                        orientation="vertical"
                                    >
                                        {steps}
                                    </Stepper>
                                ) : (
                                    <StepUri field={field} fields={fields} />
                                )}
                            </div>
                            <FieldExcerpt
                                className="publication-excerpt-for-edition"
                                colStyle={styles.column}
                                onHeaderClick={null}
                                isPreview
                            />
                        </div>
                    )}
                </DialogContent>
                <DialogActions>{actions}</DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    const field = fromFields.getEditedField(state);

    return {
        field,
        initialValues: field ? fromFields.getEditedField(state) : null,
        fields: field ? fromFields.getFieldsExceptEdited(state) : null,
    };
};

const mapDispatchToProps = {
    editField: editFieldAction,
    saveField: saveFieldAction,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
    FieldEditionWizardComponent,
);
