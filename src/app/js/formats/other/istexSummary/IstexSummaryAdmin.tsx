import { useTranslate } from '../../../i18n/I18NContext';
import { MenuItem, TextField } from '@mui/material';

import { useUpdateAdminArgs } from '../../utils/updateAdminArgs';
import {
    SEARCHED_FIELD_VALUES,
    SORT_YEAR_VALUES,
    CUSTOM_ISTEX_QUERY,
    SORT_YEAR_DESC,
} from './constants';
import { FormatDataParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import type { ChangeEvent } from 'react';

export const defaultArgs = {
    searchedField: CUSTOM_ISTEX_QUERY,
    sortDir: SORT_YEAR_DESC,
    yearThreshold: 50,
    documentSortBy: 'host.pages.first,title.raw',
};

type IstexSummaryArgs = {
    searchedField?: string;
    sortDir?: string;
    yearThreshold?: number;
    documentSortBy?: string;
};

type IstexSummaryAdminProps = {
    args?: IstexSummaryArgs;
    onChange: (args: IstexSummaryArgs) => void;
};

export const IstexSummaryAdmin = ({
    args = defaultArgs,
    onChange,
}: IstexSummaryAdminProps) => {
    const { translate } = useTranslate();

    const handleSearchedField = useUpdateAdminArgs<
        IstexSummaryArgs,
        'searchedField',
        ChangeEvent<HTMLInputElement>
    >('searchedField', {
        args,
        onChange,
        parseValue: (event) => event.target.value,
    });

    const handleSortDir = useUpdateAdminArgs<
        IstexSummaryArgs,
        'sortDir',
        ChangeEvent<HTMLInputElement>
    >('sortDir', { args, onChange, parseValue: (event) => event.target.value });

    const handleYearThreshold = useUpdateAdminArgs<
        IstexSummaryArgs,
        'yearThreshold',
        ChangeEvent<HTMLInputElement>
    >('yearThreshold', {
        args,
        onChange,
        parseValue: (event) => parseInt(event.target.value, 10),
    });

    const handleDocumentSortBy = useUpdateAdminArgs<
        IstexSummaryArgs,
        'documentSortBy',
        ChangeEvent<HTMLInputElement>
    >('documentSortBy', {
        args,
        onChange,
        parseValue: (event) => event.target.value,
    });

    const { searchedField, sortDir, yearThreshold, documentSortBy } = args;

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet defaultExpanded>
                <TextField
                    fullWidth
                    select
                    label={translate('searched_field')}
                    value={searchedField || defaultArgs.searchedField}
                    onChange={handleSearchedField}
                    className="searched_field"
                >
                    {SEARCHED_FIELD_VALUES.map((value) => (
                        <MenuItem key={value} value={value}>
                            {translate(value)}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    fullWidth
                    select
                    label={translate('year_sort_dir')}
                    value={sortDir || defaultArgs.sortDir}
                    onChange={handleSortDir}
                    className="year_sort_dir"
                >
                    {SORT_YEAR_VALUES.map((value) => (
                        <MenuItem key={value} value={value}>
                            {translate(value)}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    className="year_threshold"
                    type="number"
                    label={translate('year_threshold')}
                    onChange={handleYearThreshold}
                    value={yearThreshold || defaultArgs.yearThreshold}
                    fullWidth
                />
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

export default IstexSummaryAdmin;
