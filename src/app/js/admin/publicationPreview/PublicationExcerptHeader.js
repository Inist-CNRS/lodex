import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { connect } from 'react-redux';
import { fromFields } from '../selectors';
import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../propTypes';

const PublicationExcerptHeaderComponent = ({
    completedField,
    field: { name, label },
    p: polyglot,
}) => (
    <div>
        {label || name}
        {completedField &&
            <div className={`completes_${completedField.label.toLowerCase().replace(/\s/g, '_')}`}>
                {polyglot.t('completes_field_X', { field: completedField.label })}
            </div>
        }
    </div>
);

PublicationExcerptHeaderComponent.propTypes = {
    completedField: fieldPropTypes,
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
};

PublicationExcerptHeaderComponent.defaultProps = {
    completedField: null,
};

const mapStateToProps = (state, { field }) => ({
    completedField: fromFields.getCompletedField(state, field),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(PublicationExcerptHeaderComponent);
