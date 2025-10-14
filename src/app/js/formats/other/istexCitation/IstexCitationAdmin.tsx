import { useTranslate } from '../../../i18n/I18NContext';
import { MenuItem, TextField } from '@mui/material';

import { useUpdateAdminArgs } from '../../utils/updateAdminArgs';
import {
    SEARCHED_FIELD_VALUES,
    CUSTOM_ISTEX_QUERY,
} from '../istexSummary/constants';
import { FormatDataParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import type { ChangeEvent } from 'react';

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

    const handleSearchedField = useUpdateAdminArgs<
        IstexCitationArgs,
        'searchedField',
        ChangeEvent<HTMLInputElement>
    >('searchedField', {
        args,
        onChange,
        parseValue: (event) => event.target.value,
    });

    const handleDocumentSortBy = useUpdateAdminArgs<
        IstexCitationArgs,
        'documentSortBy',
        ChangeEvent<HTMLInputElement>
    >('documentSortBy', {
        args,
        onChange,
        parseValue: (event) => event.target.value,
    });

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
