import { FormControl, InputLabel, NativeSelect } from '@mui/material';
import React from 'react';
import { useTranslate } from '../../../i18n/I18NContext';
import PropTypes from 'prop-types';
import { statuses } from '../../../../../common/validator/annotation.validator';

export const StatusFilter = ({ applyValue, item }) => {
    const { translate } = useTranslate();

    return (
        <FormControl>
            <InputLabel id="annotation_status_filter">
                {translate('annotation_status')}
            </InputLabel>
            <NativeSelect
                aria-labelledby="annotation_status_filter"
                label={translate('annotation_status')}
                onChange={(e) => {
                    applyValue({ ...item, value: e.target.value });
                }}
                value={null}
            >
                <option value={null}></option>
                {statuses.map((status) => (
                    <option key={status} value={status}>
                        {translate(`annotation_status_${status}`)}
                    </option>
                ))}
            </NativeSelect>
        </FormControl>
    );
};

StatusFilter.propTypes = {
    applyValue: PropTypes.func.isRequired,
    item: PropTypes.shape({
        value: PropTypes.string,
    }).isRequired,
};
