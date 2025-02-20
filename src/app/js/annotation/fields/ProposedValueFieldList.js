import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { SelectField } from '../../lib/components/SelectField';
import { SelectMultipleField } from '../../lib/components/SelectMultipleField';

const NAME = 'proposedValue';

export function ProposedValueFieldList({ form, options, multiple }) {
    const { translate } = useTranslate();
    const label = `${translate('annotation.proposedValue')} *`;
    const selectOptions = useMemo(
        () =>
            options.map((option) => ({
                value: option,
                label: option,
            })),
        [options],
    );
    if (multiple) {
        return (
            <SelectMultipleField
                form={form}
                name={NAME}
                label={label}
                options={selectOptions}
                required
            />
        );
    }

    return (
        <SelectField
            form={form}
            name={NAME}
            label={label}
            options={selectOptions}
            required
        />
    );
}

ProposedValueFieldList.propTypes = {
    form: PropTypes.object.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    multiple: PropTypes.bool,
};
