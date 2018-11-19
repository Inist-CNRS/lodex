import React from 'react';
import get from 'lodash.get';
import translate from 'redux-polyglot/translate';

import InvalidFormat from './InvalidFormat';

export default (predicate, Component, format, type) => {
    const CheckedComponent = ({
        input,
        label,
        resource,
        field,
        p: polyglot,
        ...props
    }) => {
        const value =
            type === 'edition'
                ? get(input, 'value')
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
                input={{ ...input, value }}
                resource={resource}
                field={field}
            />
        );
    };

    return translate(CheckedComponent);
};
