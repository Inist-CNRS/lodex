import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { connect } from 'react-redux';
import memoize from 'lodash.memoize';

import { fromFields } from '../selectors';
import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../propTypes';
import getFieldClassName from '../../lib/getFieldClassName';

const getStyle = memoize(field =>
    (field.cover === 'dataset' ? ({
        fontWeight: 'bold',
        color: 'black',
    }) : null));

const ExcerptHeaderComponent = ({
    completedField,
    field,
    p: polyglot,
}) => (
    <div
        style={getStyle(field)}
    >
        {field.label || field.name}
        {completedField &&
            <div className={`completes_${getFieldClassName(completedField)}`}>
                {polyglot.t('completes_field_X', { field: completedField.label })}
            </div>
        }
    </div>
);

ExcerptHeaderComponent.propTypes = {
    completedField: fieldPropTypes,
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
};

ExcerptHeaderComponent.defaultProps = {
    completedField: null,
};

const mapStateToProps = (state, { field }) => ({
    completedField: fromFields.getCompletedField(state, field),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(ExcerptHeaderComponent);
