import get from 'lodash/get';
import React from 'react';

import PropTypes from 'prop-types';
import { translate } from '../i18n/I18NContext';
import { polyglot as polyglotPropTypes } from '../propTypes';
import InvalidFormat from './InvalidFormat';

export const isPrecomputed = (field) =>
    !!field?.transformers?.find((t) => t.operation === 'PRECOMPUTED');

export const getPrecomputedRoutineValue = (field) =>
    field.transformers
        .find((t) => t.operation === 'PRECOMPUTED')
        .args?.find((a) => a.name === 'routine')?.value;

export const isClonedField = (field) => {
    return field?.format?.name === 'fieldClone';
};

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

export default (predicate, Component, format, type) => {
    const CheckedComponent = ({
        meta,
        label,
        resource,
        field,
        p: polyglot,
        ...props
    }) => {
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

    CheckedComponent.propTypes = {
        meta: PropTypes.object.isRequired,
        label: PropTypes.string.isRequired,
        resource: PropTypes.string.isRequired,
        field: PropTypes.object.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    return translate(CheckedComponent);
};
