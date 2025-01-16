import React from 'react';
import get from 'lodash/get';

import InvalidFormat from './InvalidFormat';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../propTypes';
import { translate } from '../i18n/I18NContext';

export const isPrecomputed = (field) =>
    !!field?.transformers?.find((t) => t.operation === 'PRECOMPUTED');

export const getPrecomputedRoutineValue = (field) =>
    field.transformers
        .find((t) => t.operation === 'PRECOMPUTED')
        .args?.find((a) => a.name === 'routine')?.value;

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

    CheckedComponent.propTypes = {
        meta: PropTypes.object.isRequired,
        label: PropTypes.string.isRequired,
        resource: PropTypes.string.isRequired,
        field: PropTypes.object.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    return translate(CheckedComponent);
};
