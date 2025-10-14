import React, { useCallback, type ChangeEvent } from 'react';
import { useUpdateAdminArgs } from '../../../utils/updateAdminArgs';

export type ColumnParameter = {
    id: number;
    title: string;
    field: string;
    format: {
        name: string;
        option: unknown;
    };
};

type AbstractTableArgs = {
    params?: {
        maxSize?: number;
        maxValue?: number;
        minValue?: number;
        orderBy?: string;
    };
    pageSize?: number;
    columnsCount?: number;
    columnsParameters?: ColumnParameter[];
};

export type AbstractTableAdminProps = {
    args?: AbstractTableArgs;
    onChange: (args: AbstractTableArgs) => void;
};

export const useAbstractTableAdmin = ({
    args = {},
    onChange,
}: AbstractTableAdminProps) => {
    const styles = {
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        } as React.CSSProperties,
        input: {
            width: '185%',
        } as React.CSSProperties,
    };

    const handleParams = useUpdateAdminArgs<AbstractTableArgs, 'params'>(
        'params',
        {
            args,
            onChange,
        },
    );

    const handlePageSize = useUpdateAdminArgs<
        AbstractTableArgs,
        'pageSize',
        ChangeEvent<HTMLInputElement>
    >('pageSize', {
        args,
        onChange,
        parseValue: (event: React.ChangeEvent<HTMLInputElement>) =>
            parseInt(event.target.value, 10),
    });

    const handleColumnParameter = useCallback(
        (columnArgs: {
            parameterCount: number;
            parameters: ColumnParameter[];
        }) => {
            onChange({
                ...args,
                columnsCount: columnArgs.parameterCount,
                columnsParameters: columnArgs.parameters,
            });
        },
        [onChange, args],
    );

    return {
        styles,
        handleParams,
        handlePageSize,
        handleColumnParameter,
    };
};
