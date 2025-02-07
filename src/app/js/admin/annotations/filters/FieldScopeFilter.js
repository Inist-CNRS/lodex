import { FormControl, InputLabel, NativeSelect } from '@mui/material';
import React from 'react';
import { useTranslate } from '../../../i18n/I18NContext';
import PropTypes from 'prop-types';

const scopes = ['home', 'document', 'subRessource', 'facet', 'chart'];

export const FieldScopeFilter = ({ applyValue, item }) => {
    const { translate } = useTranslate();

    return (
        <FormControl>
            <InputLabel id="annotation_status_internal_scopes_filter">
                {translate('annotation_field_internal_scopes')}
            </InputLabel>
            <NativeSelect
                aria-labelledby="annotation_status_internal_scopes_filter"
                label={translate('annotation_field_internal_scopes')}
                onChange={(e) => {
                    applyValue({ ...item, value: e.target.value });
                }}
                value={null}
            >
                <option value={null}></option>
                {scopes.map((scope) => (
                    <option key={scope} value={scope}>
                        {translate(`${scope}_tooltip`)}
                    </option>
                ))}
            </NativeSelect>
        </FormControl>
    );
};

FieldScopeFilter.propTypes = {
    applyValue: PropTypes.func.isRequired,
    item: PropTypes.shape({
        value: PropTypes.string,
    }).isRequired,
};
