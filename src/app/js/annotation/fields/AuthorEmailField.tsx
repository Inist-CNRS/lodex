import PropTypes from 'prop-types';
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { TextField } from '../../lib/components/TextField';

// @ts-expect-error TS7031
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
