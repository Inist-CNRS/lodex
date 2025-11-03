import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { MenuItem, TextField } from '@mui/material';

import {
    SEARCHED_FIELD_VALUES,
    CUSTOM_ISTEX_QUERY,
} from '../istexSummary/constants';
import { FormatDataParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { useCallback, type ChangeEvent } from 'react';

export const defaultArgs = {
    searchedField: CUSTOM_ISTEX_QUERY,
    documentSortBy: 'publicationDate[desc]',
};

type IstexCitationArgs = {
    searchedField?: string;
    documentSortBy?: string;
};

type IstexCitationAdminProps = {
    args?: IstexCitationArgs;
    onChange: (args: {
        searchedField?: string;
        documentSortBy?: string;
    }) => void;
};

export const IstexCitationAdmin = ({
    args = defaultArgs,
    onChange,
}: IstexCitationAdminProps) => {
    const { translate } = useTranslate();

    const handleSearchedField = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                searchedField: event.target.value,
            });
        },
        [onChange, args],
    );

    const handleDocumentSortBy = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                documentSortBy: event.target.value,
            });
        },
        [onChange, args],
    );

    const { searchedField, documentSortBy } = args;

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet defaultExpanded>
                <TextField
                    fullWidth
                    select
                    label={translate('searched_field')}
                    value={searchedField || defaultArgs.searchedField}
                    onChange={handleSearchedField}
                >
                    {SEARCHED_FIELD_VALUES.map((value) => (
                        <MenuItem key={value} value={value}>
                            {translate(value)}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    className="document_sort_by"
                    label={translate('document_sort_by')}
                    onChange={handleDocumentSortBy}
                    value={documentSortBy || defaultArgs.documentSortBy}
                    fullWidth
                />
            </FormatDataParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default IstexCitationAdmin;
