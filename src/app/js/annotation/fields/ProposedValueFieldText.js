import PropTypes from 'prop-types';
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { TextField } from '../../lib/components/TextField';

export function ProposedValueFieldText({ form }) {
    const { translate } = useTranslate();
    return (
        <TextField
            form={form}
            name="proposedValue"
            label={`${translate('annotation.proposedValue')} *`}
            required
        />
    );
}

ProposedValueFieldText.propTypes = {
    form: PropTypes.object.isRequired,
};
