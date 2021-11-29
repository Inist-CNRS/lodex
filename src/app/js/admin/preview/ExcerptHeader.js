import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { connect } from 'react-redux';
import memoize from 'lodash.memoize';
import HiddenIcon from '@material-ui/icons/VisibilityOff';

import { SCOPE_DATASET } from '../../../../common/scope';
import { fromFields } from '../../sharedSelectors';
import getFieldClassName from '../../lib/getFieldClassName';
import { isLongText, getShortText } from '../../lib/longTexts';
import { URI_FIELD_NAME } from '../../../../common/uris';

import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../propTypes';
import FieldInternalIcon from '../../fields/FieldInternalIcon';

const getStyle = memoize(field => {
    if (field.scope === SCOPE_DATASET) {
        return {
            fontWeight: 'bold',
            color: 'black',
        };
    }

    if (field.name === URI_FIELD_NAME) {
        return { cursor: 'initial' };
    }

    return null;
});

const titleStyle = {
    titleBlock: {
        display: 'flex',
        flexDirection: 'column',
    },
    titleId: {
        fontWeight: 'lighter',
        fontStyle: 'italic',
        display: 'flex',
    },
    hidden: {
        marginLeft: 5,
    },
    internal: {
        display: 'flex',
        fontSize: '0.8rem',
        fontWeight: 'normal',
        alignItems: 'center',
    },
};

const ensureTextIsShort = text =>
    isLongText(text) ? getShortText(text) : text;

const isVisible = field =>
    field.display ? null : <HiddenIcon style={titleStyle.hidden} />;

const ComposedOf = ({ compositeFields, polyglot }) => {
    if (!compositeFields.length) {
        return null;
    }
    const composedOfText = polyglot.t('composed_of_fields', {
        fields: compositeFields.join(', '),
    });

    return (
        <div className="composed_by">{ensureTextIsShort(composedOfText)}</div>
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
    <div style={getStyle(field)}>
        <p style={titleStyle.titleBlock}>
            <span>{ensureTextIsShort(field.label)}</span>
            <span style={titleStyle.titleId} data-field-name={field.name}>
                (&nbsp;{ensureTextIsShort(field.name)}&nbsp;) {isVisible(field)}
            </span>
        </p>
        {completedField && (
            <div className={`completes_${getFieldClassName(completedField)}`}>
                {polyglot.t('completes_field_X', {
                    field: completedField.label,
                })}
            </div>
        )}
        <ComposedOf compositeFields={compositeFields} polyglot={polyglot} />
        <div style={titleStyle.internal}>
            {field.internalScopes &&
                field.internalScopes.map(internalScope => (
                    <FieldInternalIcon
                        key={internalScope}
                        scope={internalScope}
                    />
                ))}
            {field.internalName}
        </div>
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
