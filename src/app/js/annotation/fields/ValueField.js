import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';

export function ValueField({ form, choices }) {
    const { translate } = useTranslate();
    return (
        <form.Field name="initialValue">
            {(field) => {
                const hasErrors = !!(
                    field.state.meta.isTouched &&
                    field.state.meta.errors?.length
                );

                return (
                    <FormControl fullWidth>
                        <InputLabel id="annotation_choose_value">
                            {`${translate('annotation_choose_value')} *`}
                        </InputLabel>
                        <Select
                            label={`${translate('annotation_choose_value')} *`}
                            labelId={translate('annotation_choose_value')}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            minRows={5}
                            maxRows={10}
                            multiline
                            error={hasErrors}
                        >
                            {choices.map((choice) => (
                                <MenuItem key={choice} value={choice}>
                                    {choice}
                                </MenuItem>
                            ))}
                        </Select>
                        {hasErrors && (
                            <FormHelperText error role="alert">
                                {translate(field.state.meta.errors[0])}
                            </FormHelperText>
                        )}
                    </FormControl>
                );
            }}
        </form.Field>
    );
}

ValueField.propTypes = {
    form: PropTypes.object.isRequired,
    choices: PropTypes.array.isRequired,
};
