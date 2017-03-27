import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import memoize from 'lodash.memoize';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Stepper } from 'material-ui/Stepper';

import { editField as editFieldAction, saveField as saveFieldAction } from '../';

import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../../propTypes';
import { fromFields } from '../../selectors';

import StepValue from './StepValue';
import StepUri from './StepUri';
import StepTransforms from './StepTransforms';
import StepIdentity from './StepIdentity';
import StepDisplay from './StepDisplay';
import StepSearch from './StepSearch';
import PublicationExcerpt from '../../publicationPreview/PublicationExcerpt';

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
};

const getActions = memoize((
    field,
    step,
    stepsCount,
    polyglot,
    handlePreviousStep,
    handleNextStep,
    handleCancel,
    handleSave,
) => {
    if (!field) return [];

    if (field.name === 'uri') {
        return [
            <FlatButton
                className="btn-exit-column-edition"
                label={polyglot.t('cancel')}
                onTouchTap={handleCancel}
            />,
            <FlatButton
                className="btn-next"
                label={polyglot.t('save')}
                primary
                onTouchTap={handleSave}
            />,
        ];
    }

    if (step === 0) {
        return [
            <FlatButton
                className="btn-exit-column-edition"
                label={polyglot.t('cancel')}
                onTouchTap={handleCancel}
            />,
            <FlatButton
                className="btn-next"
                label={polyglot.t('next')}
                primary
                onTouchTap={handleNextStep}
            />,
        ];
    }

    if (step === stepsCount - 1) {
        return [
            <FlatButton
                className="btn-exit-column-edition"
                label={polyglot.t('cancel')}
                onTouchTap={handleCancel}
            />,
            <FlatButton
                className="btn-previous"
                label={polyglot.t('previous')}
                onTouchTap={handlePreviousStep}
            />,
            <FlatButton
                className="btn-next"
                label={polyglot.t('save')}
                primary
                onTouchTap={handleSave}
            />,
        ];
    }

    return [
        <FlatButton
            className="btn-exit-column-edition"
            label={polyglot.t('cancel')}
            onTouchTap={handleCancel}
        />,
        <FlatButton
            className="btn-previous"
            label={polyglot.t('previous')}
            primary
            onTouchTap={handlePreviousStep}
        />,
        <FlatButton
            className="btn-next"
            label={polyglot.t('next')}
            primary
            onTouchTap={handleNextStep}
        />,
    ];
}, (field, step, stepsCount) => (field ? `${field.name}_${step}_${stepsCount}` : 'not_editing'));

class FieldEditionWizardComponent extends Component {
    static propTypes = {
        editField: PropTypes.func.isRequired,
        field: fieldPropTypes,
        fields: PropTypes.arrayOf(fieldPropTypes),
        lines: PropTypes.arrayOf(PropTypes.object).isRequired,
        saveField: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    }

    static defaultProps = {
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

    handleCancel = () => {
        this.props.editField(null);
    }

    handleSave = () => {
        this.props.saveField();
    }

    render() {
        const {
            field,
            fields,
            lines,
            p: polyglot,
        } = this.props;

        const { step } = this.state;

        let steps = [];

        if (field && field.name !== 'uri') {
            steps = [
                <StepIdentity key={'identity'} field={field} fields={fields} />,
                <StepValue key={'value'} field={field} fields={fields} />,
                <StepTransforms key={'transformations'} field={field} fields={fields} />,
                <StepSearch key={'search'} field={field} fields={fields} />,
                <StepDisplay key={'display'} field={field} fields={fields} />,
            ];
        }

        const actions = getActions(
            field,
            step,
            steps.length,
            polyglot,
            this.handlePreviousStep,
            this.handleNextStep,
            this.handleCancel,
            this.handleSave,
        );

        return (
            <Dialog
                open={!!field}
                actions={actions}
                title={field ? field.label : ''}
                contentStyle={styles.modal}
            >
                {field &&
                    <div style={styles.container}>
                        <div style={styles.form}>
                            {field.name !== 'uri'
                                ? (
                                    <Stepper activeStep={step} orientation="vertical">
                                        {steps}
                                    </Stepper>
                                )
                                : <StepUri field={field} fields={fields} />
                            }
                        </div>
                        <PublicationExcerpt
                            className="publication-excerpt-for-edition"
                            columns={[field]}
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

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(FieldEditionWizardComponent);
