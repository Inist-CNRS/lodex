import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Dialog from 'material-ui/Dialog';
import { Stepper } from 'material-ui/Stepper';

import { getFieldFormData, editField as editFieldAction, saveField as saveFieldAction } from '../';
import { field as fieldPropTypes } from '../../../propTypes';
import { fromFields } from '../../selectors';
import StepValue from './StepValue';
import StepUri from './StepUri';
import StepTransforms from './StepTransforms';
import StepIdentity from './StepIdentity';
import StepDisplay from './StepDisplay';
import StepSearch from './StepSearch';
import StepSemantics from './StepSemantics';
import PublicationExcerpt from '../../publicationPreview/PublicationExcerpt';
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
    modal: {
        maxWidth: '100%',
    },
    column: {
        minWidth: '10rem',
        maxWidth: '10rem',
    },
    title: {
        display: 'flex',
    },
    titleLabel: {
    },
};

class FieldEditionWizardComponent extends Component {
    static propTypes = {
        editField: PropTypes.func.isRequired,
        editedField: fieldPropTypes,
        field: fieldPropTypes,
        fields: PropTypes.arrayOf(fieldPropTypes),
        lines: PropTypes.arrayOf(PropTypes.object).isRequired,
        saveField: PropTypes.func.isRequired,
    }

    static defaultProps = {
        editedField: null,
        field: null,
        fields: null,
    }

    constructor(props) {
        super(props);

        this.state = { step: 0 };
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.field || !this.props.field || nextProps.field.name !== this.props.field.name) {
            this.setState({ step: 0 });
        }
    }

    handleNextStep = () => {
        this.setState({ step: this.state.step + 1 });
    }

    handlePreviousStep = () => {
        this.setState({ step: this.state.step - 1 });
    }

    handleSelectStep = (step) => {
        this.setState({ step });
    }

    handleCancel = () => {
        this.props.editField(null);
    }

    handleSave = () => {
        this.props.saveField();
    }

    render() {
        const {
            editedField,
            field,
            fields,
            lines,
        } = this.props;

        const { step } = this.state;

        if (!field) return null;

        let steps = [];

        if (field && field.name !== 'uri') {
            steps = [
                <StepIdentity
                    key={'identity'}
                    index={0}
                    active={step === 0}
                    field={field}
                    fields={fields}
                    onSelectStep={this.handleSelectStep}
                />,
                <StepValue
                    key={'value'}
                    index={1} active={step === 1}
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
            <Dialog
                open={!!field}
                actions={actions}
                title={title}
                contentStyle={styles.modal}
                autoScrollBodyContent
                repositionOnUpdate={false}
            >
                {field &&
                    <div style={styles.container}>
                        <div id="field_form" style={styles.form}>
                            {field.name !== 'uri'
                                ? (
                                    <Stepper linear={false} activeStep={step} orientation="vertical">
                                        {steps}
                                    </Stepper>
                                )
                                : <StepUri field={field} fields={fields} />
                            }
                        </div>
                        <PublicationExcerpt
                            className="publication-excerpt-for-edition"
                            columns={[editedField]}
                            lines={lines}
                            colStyle={styles.column}
                            onHeaderClick={null}
                            isPreview
                        />
                    </div>
                }
            </Dialog>
        );
    }
}

const mapStateToProps = (state) => {
    const field = fromFields.getEditedField(state);
    const editedField = getFieldFormData(state) || field;

    return {
        field,
        editedField,
        initialValues: field ? fromFields.getEditedField(state) : null,
        fields: field ? fromFields.getFieldsExceptEdited(state) : null,
    };
};

const mapDispatchToProps = {
    editField: editFieldAction,
    saveField: saveFieldAction,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(FieldEditionWizardComponent);
