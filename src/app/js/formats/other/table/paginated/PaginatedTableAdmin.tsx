import React from 'react';
import { TextField } from '@mui/material';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

import {
    useAbstractTableAdmin,
    type AbstractTableAdminProps,
} from '../core/useAbstractTableAdmin';
import TableColumnsParameters from '../core/TableColumnsParameters';
import { FormatDefaultParamsFieldSet } from '../../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    pageSize: 6,
    params: {
        maxSize: 6,
        orderBy: 'value/asc',
    },
    columnsCount: 0,
    columnsParameters: [],
};

const PaginatedTableAdmin: React.FC<AbstractTableAdminProps> = ({
    args = defaultArgs,
    onChange,
}) => {
    const { translate: t } = useTranslate();
    const { handlePageSize, handleColumnParameter } = useAbstractTableAdmin({
        args,
        onChange,
    });

    return (
        <FormatGroupedFieldSet>
            <FormatDefaultParamsFieldSet>
                <TextField
                    fullWidth
                    type="number"
                    label={t('format_table_page_size')}
                    onChange={handlePageSize}
                    value={args.pageSize || 10}
                    variant="standard"
                />
            </FormatDefaultParamsFieldSet>
            <TableColumnsParameters
                onChange={handleColumnParameter}
                parameters={
                    args.columnsParameters || defaultArgs.columnsParameters
                }
                parameterCount={args.columnsCount || defaultArgs.columnsCount}
            />
        </FormatGroupedFieldSet>
    );
};

export default PaginatedTableAdmin;
