import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { SelectField } from '../../lib/components/SelectField';

export function ProposedValueFieldList({ form, options }) {
    const { translate } = useTranslate();

    const optionList = useMemo(
        () =>
            options
                .trim()
                .split('\n')
                .map((option) => option.trim())
                .filter((option) => option),
        [options],
    );
    return (
        <SelectField
            form={form}
            name="proposedValue"
            label={`${translate('annotation.proposedValue')} *`}
            required
            options={optionList.map((option) => ({
                value: option,
                label: option,
            }))}
        />
    );
}

ProposedValueFieldList.propTypes = {
    form: PropTypes.object.isRequired,
    options: PropTypes.string.isRequired,
};
