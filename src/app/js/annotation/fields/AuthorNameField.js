import PropTypes from 'prop-types';
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { TextField } from './TextField';

export function AuthorNameField({ form }) {
    const { translate } = useTranslate();

    return (
        <TextField
            form={form}
            name="authorName"
            label={`${translate('annotation.authorName')} *`}
        />
    );
}

AuthorNameField.propTypes = {
    form: PropTypes.object.isRequired,
};
