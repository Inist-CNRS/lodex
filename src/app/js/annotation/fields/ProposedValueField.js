import PropTypes from 'prop-types';
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { TextField } from './TextField';

export function ProposedValueField({ form }) {
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

ProposedValueField.propTypes = {
    form: PropTypes.object.isRequired,
};
