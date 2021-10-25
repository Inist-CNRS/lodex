import React from 'react';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import translate from 'redux-polyglot/translate';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import withHandlers from 'recompose/withHandlers';
import { reduxForm, Field } from 'redux-form';

import { createEnrichment } from '.';
import { fromEnrichments } from '../selectors';
import FormTextField from '../../lib/components/FormTextField';
import { isLoading } from '../subresource';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';

export const FormEnrichmentComponent = ({
    isLoading,
    onAddEnrichment,
    handleKeyPress,
    p: polyglot,
}) => {
    const handleSubmit = () => {
        console.log('salut');
    };
    return (
        <form id="enrichment_form" onSubmit={handleSubmit}>
            <Field
                name="name"
                component={FormTextField}
                label={polyglot.t('fieldName')}
                onKeyPress={handleKeyPress}
                autoFocus
                fullWidth
                style={{ marginBottom: 16 }}
            />
            <Field
                name="rule"
                component={FormTextField}
                label={polyglot.t('expand_rules')}
                onKeyPress={handleKeyPress}
                multiline
                fullWidth
                rows={10}
                variant="outlined"
            />
            <ButtonWithStatus
                raised
                key="save"
                color="primary"
                loading={isLoading}
                onClick={handleSubmit}
            >
                {polyglot.t('save')}
            </ButtonWithStatus>
        </form>
    );
};

FormEnrichmentComponent.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    onAddEnrichment: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    isLoading: fromEnrichments.isLoading(state),
});

const mapDispatchToProps = {
    onAddEnrichment: createEnrichment,
};

export default compose(
    translate,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        handleKeyPress: ({ handleSubmit }) => event => {
            if (event.key === 'Enter') {
                handleSubmit();
            }
        },
    }),
    reduxForm({
        form: 'ENRICHMENT_FORM',
    }),
)(FormEnrichmentComponent);
