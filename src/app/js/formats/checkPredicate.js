import React from 'react';
import get from 'lodash.get';
import translate from 'redux-polyglot/translate';

import InvalidFormat from './InvalidFormat';

export const isPrecomputed = field =>
    !!field?.transformers?.find(t => t.operation === 'PRECOMPUTED');

export const getPrecomputedRoutineValue = field =>
    field.transformers
        .find(t => t.operation === 'PRECOMPUTED')
        .args?.find(a => a.name === 'routine')?.value;

export default (predicate, Component, format, type) => {
    const CheckedComponent = ({
        meta,
        label,
        resource,
        field,
        p: polyglot,
        ...props
    }) => {
        const value =
            type === 'edition'
                ? get(meta, 'initial')
                : isPrecomputed(field)
                ? getPrecomputedRoutineValue(field)
                : get(resource, field.name);

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
