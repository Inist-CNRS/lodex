import { FormControl, InputLabel, NativeSelect } from '@mui/material';
import React from 'react';
import { useTranslate } from '../../../i18n/I18NContext';
import PropTypes from 'prop-types';
import { statuses } from '../../../../../common/validator/annotation.validator';

// @ts-expect-error TS7031
export const StatusFilter = ({ applyValue, item }) => {
    const { translate } = useTranslate();

    return (
        <FormControl>
            <InputLabel id="annotation_status_filter">
                {translate('annotation_status')}
            </InputLabel>
            <NativeSelect
                aria-labelledby="annotation_status_filter"
                // @ts-expect-error TS2322
                label={translate('annotation_status')}
                onChange={(e) => {
                    applyValue({ ...item, value: e.target.value });
                }}
                value={null}
            >
                {/*
                 // @ts-expect-error TS2322 */}
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
