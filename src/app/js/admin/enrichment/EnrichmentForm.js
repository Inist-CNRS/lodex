import React from 'react';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import translate from 'redux-polyglot/translate';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { reduxForm, Field } from 'redux-form';

import { createEnrichment, updateEnrichment, deleteEnrichment } from '.';
import { fromEnrichments } from '../selectors';
import FormTextField from '../../lib/components/FormTextField';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';

export const EnrichmentFormComponent = ({
    isLoading,
    onAddEnrichment,
    onUpdateEnrichment,
    onDeleteEnrichment,
    p: polyglot,
    history,
    isEdit,
    initialValues,
}) => {
    const handleSubmit = e => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const [name, rule] = [formData.get('name'), formData.get('rule')];

        if (isEdit) {
            onUpdateEnrichment({
                resource: { _id: initialValues._id, name, rule },
            });
        } else {
            onAddEnrichment({
                resource: { name, rule },
                callback: id => history.push(`/data/enrichment/${id}`),
            });
        }
    };

    const handleDelete = e => {
        e.preventDefault();

        if (isEdit) {
            onDeleteEnrichment({
                id: initialValues._id },
            );
        }
    };

    return (
        <form id="enrichment_form" onSubmit={handleSubmit}>
            <Field
                name="name"
                component={FormTextField}
                label={polyglot.t('fieldName')}
                autoFocus
                fullWidth
                style={{ marginBottom: 16 }}
            />
            <Field
                name="rule"
                component={FormTextField}
                label={polyglot.t('expand_rules')}
                multiline
                fullWidth
                rows={10}
                variant="outlined"
            />
            <ButtonWithStatus
                raised
                key="save"
                color="primary"
                type="submit"
                loading={isLoading}
                style={{ marginTop: 10 }}
            >
                {polyglot.t('save')}
            </ButtonWithStatus>
            {isEdit && (
                <ButtonWithStatus
                    variant="text"
                    key="delete"
                    color="secondary"
                    loading={isLoading}
                    style={{ marginTop: 10 }}
                    onClick={handleDelete}
                >
                    {polyglot.t('delete')}
                </ButtonWithStatus>
            )}
        </form>
    );
};

EnrichmentFormComponent.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    onAddEnrichment: PropTypes.func.isRequired,
    onUpdateEnrichment: PropTypes.func.isRequired,
    onDeleteEnrichment: PropTypes.func.isRequired,
    isEdit: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = (state, { match }) => ({
    isLoading: fromEnrichments.isLoading(state),
    enrichments: fromEnrichments.enrichments(state),
    initialValues: fromEnrichments
        .enrichments(state)
        .find(sr => sr._id === match.params.enrichmentId),
});

const mapDispatchToProps = {
    onAddEnrichment: createEnrichment,
    onUpdateEnrichment: updateEnrichment,
    onDeleteEnrichment: deleteEnrichment,
};

const validate = (values, { p: polyglot }) => {
    const errors = ['name', 'rule'].reduce((currentErrors, field) => {
        if (!values[field]) {
            return {
                ...currentErrors,
                [field]: polyglot.t('required'),
            };
        }
        return currentErrors;
    }, {});

    return errors;
};

export default compose(
    translate,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: 'ENRICHMENT_FORM',
        validate,
    }),
)(EnrichmentFormComponent);
