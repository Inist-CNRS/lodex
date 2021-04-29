import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

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

import { hideAddColumns } from '../../admin/parsing';
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
        width: 800,
    },
    form: {
        borderRight: '1px solid rgb(224, 224, 224)',
        marginRight: '1rem',
        paddingRight: '1rem',
        flexGrow: 1,
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
    closeButton: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    dialogContent: {
        height: 'calc(90vh - 64px - 52px)',
    },
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
        this.props.handleHideExistingColumns();
    };

    handleSave = () => {
        this.props.saveField();
        this.props.handleHideExistingColumns();
    };

    render() {
        const { field, fields, filter } = this.props;
        const { step } = this.state;

        if (!field) return null;

        let steps = [];

        if (field && field.name !== 'uri') {
            steps = [
                <StepIdentity
                    key="identity"
                    id="step-identity"
                    isSubresourceField={!!field.subresourceId}
                />,
                !field.subresourceId && (
                    <StepValue key="value" filter={filter} />
                ),
                <StepTransforms
                    key="transformers"
                    isSubresourceField={!!field.subresourceId}
                />,
                !field.subresourceId && (
                    <StepSemantics
                        fields={fields}
                        field={field}
                        key="semantics"
                    />
                ),
                <StepDisplay keepMeta={!field.subresourceId} key="display" />,
                !field.subresourceId && <StepSearch key="search" />,
            ]
                .filter(x => x)
                .map((el, index) =>
                    React.cloneElement(el, {
                        index,
                        active: step === index,
                        fields,
                        field,
                        filter,
                        onSelectStep: this.handleSelectStep,
                    }),
                );
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
                scroll="body"
                className="wizard"
                maxWidth="xl"
            >
                <DialogTitle>
                    {title}
                    <IconButton
                        aria-label="close"
                        style={styles.closeButton}
                        onClick={this.handleCancel}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent style={styles.dialogContent}>
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

FieldEditionWizardComponent.propTypes = {
    filter: PropTypes.string,
    handleHideExistingColumns: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
    const field = fromFields.getEditedField(state);

    return {
        field,
        initialValues: field || null,
        fields: field ? fromFields.getFieldsExceptEdited(state) : null,
    };
};

const mapDispatchToProps = {
    editField: editFieldAction,
    saveField: saveFieldAction,
    handleHideExistingColumns: hideAddColumns,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
    FieldEditionWizardComponent,
);
