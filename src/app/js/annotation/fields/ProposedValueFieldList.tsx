import PropTypes from 'prop-types';
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { AutocompleteField } from '../../lib/components/AutocompleteField';
import { AutocompleteMultipleField } from '../../lib/components/AutocompleteMultipleField';

const NAME = 'proposedValue';

export function ProposedValueFieldList({
    // @ts-expect-error TS7031
    form,
    // @ts-expect-error TS7031
    options,
    // @ts-expect-error TS7031
    multiple,
    // @ts-expect-error TS7031
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
                supportsNewValues={supportsNewValues}
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
            supportsNewValues={supportsNewValues}
        />
    );
}

ProposedValueFieldList.propTypes = {
    form: PropTypes.object.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    multiple: PropTypes.bool,
    supportsNewValues: PropTypes.bool,
};
