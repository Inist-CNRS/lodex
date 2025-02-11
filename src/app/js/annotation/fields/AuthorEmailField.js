import PropTypes from 'prop-types';
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { TextField } from '../../../../common/fields/TextField';

export function AuthorEmailField({ form }) {
    const { translate } = useTranslate();
    return (
        <TextField
            form={form}
            name="authorEmail"
            label={translate('annotation.authorEmail')}
            helperText={translate('annotation.authorEmail_helpText')}
        />
    );
}

AuthorEmailField.propTypes = {
    form: PropTypes.object.isRequired,
};
