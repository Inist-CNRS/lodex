import PropTypes from 'prop-types';
// @ts-expect-error TS6133
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { TextField } from '../../lib/components/TextField';

// @ts-expect-error TS7031
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
