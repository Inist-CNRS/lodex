import PropTypes from 'prop-types';
import React from 'react';

import { ProposedValueFieldList } from './ProposedValueFieldList';
import { ProposedValueFieldText } from './ProposedValueFieldText';

// @ts-expect-error TS7031
export function ProposedValueField({ form, field, initialValue }) {
    if (
        field.annotationFormat === 'list' &&
        field.annotationFormatListOptions?.length
    ) {
        return (
            <ProposedValueFieldList
                form={form}
                options={field.annotationFormatListOptions}
                multiple={field.annotationFormatListKind === 'multiple'}
                supportsNewValues={
                    field.annotationFormatListSupportsNewValues !== false
                }
            />
        );
    }

    return <ProposedValueFieldText form={form} initialValue={initialValue} />;
}

ProposedValueField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    initialValue: PropTypes.string,
};
