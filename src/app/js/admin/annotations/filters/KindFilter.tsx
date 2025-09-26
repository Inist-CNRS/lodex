import { FormControl, InputLabel, NativeSelect } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { kinds } from '../../../../../common/validator/annotation.validator';
import { useTranslate } from '../../../i18n/I18NContext';

// @ts-expect-error TS7031
export const KindFilter = ({ applyValue, item }) => {
    const { translate } = useTranslate();

    return (
        <FormControl>
            <InputLabel id="annotation_kind_filter">
                {translate('annotation_kind')}
            </InputLabel>
            <NativeSelect
                aria-labelledby="annotation_kind_filter"
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
                {kinds.map((kind) => (
                    <option key={kind} value={kind}>
                        {translate(kind)}
                    </option>
                ))}
            </NativeSelect>
        </FormControl>
    );
};

KindFilter.propTypes = {
    applyValue: PropTypes.func.isRequired,
    item: PropTypes.shape({
        value: PropTypes.string,
    }).isRequired,
};
