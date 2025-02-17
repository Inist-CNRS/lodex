import PropTypes from 'prop-types';
import React from 'react';

import { ProposedValueFieldList } from './ProposedValueFieldList';
import { ProposedValueFieldText } from './ProposedValueFieldText';

export function ProposedValueField({ form, field }) {
    if (
        field.annotationFormat === 'list' &&
        field.annotationFormatListOptions?.trim().length
    ) {
        return (
            <ProposedValueFieldList
                form={form}
                options={field.annotationFormatListOptions}
            />
        );
    }

    return <ProposedValueFieldText form={form} />;
}

ProposedValueField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
};
