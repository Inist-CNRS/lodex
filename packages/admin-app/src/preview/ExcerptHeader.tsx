import HiddenIcon from '@mui/icons-material/VisibilityOff';
import memoize from 'lodash/memoize';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { SCOPE_DATASET, URI_FIELD_NAME } from '@lodex/common';
import { fromFields } from '@lodex/frontend-common/sharedSelectors';
import getFieldClassName from '@lodex/frontend-common/utils/getFieldClassName';
import {
    getShortText,
    isLongText,
} from '@lodex/frontend-common/utils/longTexts';

import type { Field } from '@lodex/frontend-common/fields/types';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import FieldInternalIcon from '../fields/FieldInternalIcon';

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

interface ComposedOfProps {
    compositeFields: string[];
}

const ComposedOf = ({ compositeFields }: ComposedOfProps) => {
    const { translate } = useTranslate();
    if (!compositeFields.length) {
        return null;
    }
    const composedOfText = translate('composed_of_fields', {
        fields: compositeFields.join(', '),
    });

    return (
        <div className="composed_by">{ensureTextIsShort(composedOfText)}</div>
    );
};

interface ExcerptHeaderComponentProps {
    completedField?: unknown;
    field: Field;
    compositeFields?: string[];
}

const ExcerptHeaderComponent = ({
    completedField,
    compositeFields = [],
    field,
}: ExcerptHeaderComponentProps) => {
    const { translate } = useTranslate();
    return (
        // @ts-expect-error TS2322
        <div style={getStyle(field)}>
            {/*
         // @ts-expect-error TS2322 */}
            <p style={titleStyle.titleBlock}>
                <span>{ensureTextIsShort(field.label)}</span>
                <span style={titleStyle.titleId} data-field-name={field.name}>
                    (&nbsp;{ensureTextIsShort(field.name)}&nbsp;){' '}
                    {isVisible(field)}
                </span>
            </p>
            {completedField && (
                <div
                    className={`completes_${getFieldClassName(completedField)}`}
                >
                    {translate('completes_field_X', {
                        // @ts-expect-error TS2339
                        field: completedField.label,
                    })}
                </div>
            )}
            <ComposedOf compositeFields={compositeFields} />
            <div style={titleStyle.internal}>
                {/*
             // @ts-expect-error TS18046 */}
                {field.internalScopes &&
                    // @ts-expect-error TS7006
                    field.internalScopes.map((internalScope) => (
                        // @ts-expect-error TS2741
                        <FieldInternalIcon
                            key={internalScope}
                            scope={internalScope}
                        />
                    ))}
                {/*
             // @ts-expect-error TS18046 */}
                {field.internalName}
            </div>
        </div>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { field }) => ({
    completedField: fromFields.getCompletedField(state, field),
    compositeFields: fromFields.getCompositeFieldsNamesByField(state, field),
});

export default compose(
    connect(mapStateToProps),
    // @ts-expect-error TS2345
)(ExcerptHeaderComponent);
