// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import memoize from 'lodash/memoize';
import HiddenIcon from '@mui/icons-material/VisibilityOff';

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
import { translate } from '../../i18n/I18NContext';

const getStyle = memoize((field) => {
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

// @ts-expect-error TS7006
const ensureTextIsShort = (text) =>
    isLongText(text) ? getShortText(text) : text;

// @ts-expect-error TS7006
const isVisible = (field) =>
    field.display ? null : <HiddenIcon style={titleStyle.hidden} />;

// @ts-expect-error TS7031
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
    // @ts-expect-error TS7031
    completedField,
    // @ts-expect-error TS7031
    compositeFields,
    // @ts-expect-error TS7031
    field,
    // @ts-expect-error TS7031
    p: polyglot,
}) => (
    // @ts-expect-error TS2322
    <div style={getStyle(field)}>
        {/*
         // @ts-expect-error TS2322 */}
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
                // @ts-expect-error TS7006
                field.internalScopes.map((internalScope) => (
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

// @ts-expect-error TS7006
const mapStateToProps = (state, { field }) => ({
    // @ts-expect-error TS2339
    completedField: fromFields.getCompletedField(state, field),
    // @ts-expect-error TS2339
    compositeFields: fromFields.getCompositeFieldsNamesByField(state, field),
});

export default compose(
    connect(mapStateToProps),
    translate,
    // @ts-expect-error TS2345
)(ExcerptHeaderComponent);
