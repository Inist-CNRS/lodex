import PropTypes from 'prop-types';
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { AutocompleteField } from '../../lib/components/AutocompleteField';
import { AutocompleteMultipleField } from '../../lib/components/AutocompleteMultipleField';

const NAME = 'proposedValue';

export function ProposedValueFieldList({
    form,
    options,
    multiple,
    supportsNewValues,
}) {
    const { translate } = useTranslate();
    const label = `${translate('annotation.proposedValue')} *`;

    if (multiple) {
        return (
            <AutocompleteMultipleField
                form={form}
                name={NAME}
                label={label}
                options={options}
                required
            />
        );
    }

    return (
        <AutocompleteField
            form={form}
            name={NAME}
            label={label}
            options={options}
            required
            freeSolo={supportsNewValues}
        />
    );
}

ProposedValueFieldList.propTypes = {
    form: PropTypes.object.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    multiple: PropTypes.bool,
    supportsNewValues: PropTypes.bool,
};
