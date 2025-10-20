import { FormControl, InputLabel, NativeSelect } from '@mui/material';
// @ts-expect-error TS6133
import React from 'react';
import { useTranslate } from '../../../i18n/I18NContext';
import { statuses } from '../../../../../common/validator/annotation.validator';

interface StatusFilterProps {
    applyValue(...args: unknown[]): unknown;
    item: {
        value?: string;
    };
}

export const StatusFilter = ({
    applyValue,
    item
}: StatusFilterProps) => {
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
