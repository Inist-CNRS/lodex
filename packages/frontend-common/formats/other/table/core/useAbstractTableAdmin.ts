import React, { useCallback } from 'react';

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

    const handleParams = useCallback(
        (params: AbstractTableArgs['params']) => {
            onChange({
                ...args,
                params,
            });
        },
        [onChange, args],
    );

    const handlePageSize = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                pageSize: parseInt(event.target.value, 10),
            });
        },
        [onChange, args],
    );

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
