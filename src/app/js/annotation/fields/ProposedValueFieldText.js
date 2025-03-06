import PropTypes from 'prop-types';
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { TextField } from '../../lib/components/TextField';

export function ProposedValueFieldText({ form, initialValue }) {
    const { translate } = useTranslate();

    return (
        <TextField
            form={form}
            name="proposedValue"
            label={`${translate('annotation.proposedValue')} *`}
            required
            initialValue={initialValue}
            multiline
            clearable
        />
    );
}

ProposedValueFieldText.propTypes = {
    form: PropTypes.object.isRequired,
    initialValue: PropTypes.string,
};
