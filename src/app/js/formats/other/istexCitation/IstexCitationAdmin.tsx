import { useTranslate } from '../../../i18n/I18NContext';
import { MenuItem, TextField } from '@mui/material';

import { useUpdateAdminArgs } from '../../utils/updateAdminArgs';
import {
    SEARCHED_FIELD_VALUES,
    CUSTOM_ISTEX_QUERY,
} from '../istexSummary/constants';
import { FormatDataParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

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
        'searchedField'
    >('searchedField', { args, onChange });

    const handleDocumentSortBy = useUpdateAdminArgs<
        IstexCitationArgs,
        'documentSortBy'
    >('documentSortBy', { args, onChange });

    const { searchedField, documentSortBy } = args;

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet defaultExpanded>
                <TextField
                    fullWidth
                    select
                    label={translate('searched_field')}
                    value={searchedField || defaultArgs.searchedField}
                    onChange={(e) => handleSearchedField(e.target.value)}
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
                    onChange={(e) => handleDocumentSortBy(e.target.value)}
                    value={documentSortBy || defaultArgs.documentSortBy}
                    fullWidth
                />
            </FormatDataParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default IstexCitationAdmin;
