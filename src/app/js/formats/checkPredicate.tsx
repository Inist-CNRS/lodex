import get from 'lodash/get';

import { translate } from '../i18n/I18NContext';
import InvalidFormat from './InvalidFormat';

// @ts-expect-error TS7006
export const isPrecomputed = (field) =>
    // @ts-expect-error TS7006
    !!field?.transformers?.find((t) => t.operation === 'PRECOMPUTED');

// @ts-expect-error TS7006
export const getPrecomputedRoutineValue = (field) =>
    field.transformers
        // @ts-expect-error TS7006
        .find((t) => t.operation === 'PRECOMPUTED')
        // @ts-expect-error TS7006
        .args?.find((a) => a.name === 'routine')?.value;

// @ts-expect-error TS7006
export const isClonedField = (field) => {
    return field?.format?.name === 'fieldClone';
};

// @ts-expect-error TS7031
export const getFieldValue = ({ type, field, meta, resource }) => {
    if (type === 'edition') {
        return get(meta, 'initial');
    }

    if (isClonedField(field)) {
        return '';
    }

    if (isPrecomputed(field)) {
        return getPrecomputedRoutineValue(field);
    }

    return get(resource, field.name);
};

interface CheckedComponentProps {
    meta: object;
    label: string;
    resource: string;
    field: object;
    p: unknown;
}

// @ts-expect-error TS7006
export default (predicate, Component, format, type) => {
    const CheckedComponent = ({
        meta,

        label,

        resource,

        field,

        ...props
    }: CheckedComponentProps) => {
        const value = getFieldValue({
            type,
            field,
            meta,
            resource,
        });
        if (typeof value === 'undefined') {
            return null;
        }

        if (!predicate(value)) {
            return <InvalidFormat format={format} value={value} />;
        }

        return (
            <Component
                {...props}
                label={label}
                meta={meta}
                resource={resource}
                field={field}
            />
        );
    };

    return translate(CheckedComponent);
};
