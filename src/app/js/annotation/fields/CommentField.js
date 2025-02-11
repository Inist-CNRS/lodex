import PropTypes from 'prop-types';
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { TextField } from './TextField';

export function CommentField({ form }) {
    const { translate } = useTranslate();
    return (
        <TextField
            form={form}
            name="comment"
            label={`${translate('annotation.comment')} *`}
            multiline
        />
    );
}

CommentField.propTypes = {
    form: PropTypes.object.isRequired,
};
