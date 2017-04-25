import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { connect } from 'react-redux';
import memoize from 'lodash.memoize';

import { fromFields } from '../../sharedSelectors';
import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../propTypes';
import getFieldClassName from '../../lib/getFieldClassName';
import { isLongText, getShortText } from '../../lib/longTexts';

const getStyle = memoize(field =>
    (field.cover === 'dataset' ? ({
        fontWeight: 'bold',
        color: 'black',
    }) : null));

const ensureTextIsShort = text => (isLongText(text) ? getShortText(text) : text);

const ComposedOf = ({ compositeFields, polyglot }) => {
    if (!compositeFields.length) {
        return null;
    }
    const composedOfText = polyglot.t('composed_of_fields', { fields: compositeFields.join(', ') });

    return (
        <div className="composed_by">
            {ensureTextIsShort(composedOfText)}
        </div>
    );
};

ComposedOf.propTypes = {
    polyglot: polyglotPropTypes.isRequired,
    compositeFields: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const ExcerptHeaderComponent = ({
    completedField,
    compositeFields,
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
        <ComposedOf compositeFields={compositeFields} polyglot={polyglot} />
    </div>
);

ExcerptHeaderComponent.propTypes = {
    completedField: fieldPropTypes,
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
    compositeFields: PropTypes.arrayOf(PropTypes.string),
};

ExcerptHeaderComponent.defaultProps = {
    completedField: null,
    compositeFields: [],
};

const mapStateToProps = (state, { field }) => ({
    completedField: fromFields.getCompletedField(state, field),
    compositeFields: fromFields.getCompositeFieldsNamesByField(state, field),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(ExcerptHeaderComponent);
