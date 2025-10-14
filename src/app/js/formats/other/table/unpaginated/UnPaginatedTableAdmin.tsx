import {
    useAbstractTableAdmin,
    type AbstractTableAdminProps,
} from '../core/useAbstractTableAdmin';
import RoutineParamsAdmin from '../../../utils/components/admin/RoutineParamsAdmin';
import TableColumnsParameters from '../core/TableColumnsParameters';
import React from 'react';
import {
    FormatDataParamsFieldSet,
    FormatDefaultParamsFieldSet,
} from '../../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    params: {
        maxSize: 6,
        orderBy: 'value/asc',
    },
    columnsCount: 0,
    columnsParameters: [],
};

const UnPaginatedTableAdmin: React.FC<AbstractTableAdminProps> = ({
    args = defaultArgs,
    onChange,
}) => {
    const { handleParams, handleColumnParameter } = useAbstractTableAdmin({
        args,
        onChange,
    });

    const { params, columnsCount, columnsParameters } = args;

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={handleParams}
                    showMaxSize={true}
                    showMaxValue={true}
                    showMinValue={true}
                    showOrderBy={true}
                />
            </FormatDataParamsFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <TableColumnsParameters
                    onChange={handleColumnParameter}
                    parameterCount={columnsCount || 0}
                    parameters={columnsParameters || []}
                />
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default UnPaginatedTableAdmin;
