import React, { useCallback, useEffect, useState } from 'react';
import { Checkbox } from '@mui/material';

export const useDatagridSelection = (data) => {
    const [selectionState, setSelectionState] = useState({
        allSelected: false,
        selectedRowIds: [],
    });

    const handleSelectAll = useCallback(
        (event) => {
            event.stopPropagation();
            event.preventDefault();
            if (!data) {
                return;
            }

            setSelectionState(({ allSelected }) => {
                const newAllSelected = !allSelected;

                return {
                    allSelected: newAllSelected,
                    selectedRowIds: newAllSelected
                        ? data.map((row) => row._id)
                        : [],
                };
            });
        },
        [data],
    );

    const handleCheckboxChange = useCallback(
        (event, id) => {
            event.stopPropagation();
            event.preventDefault();
            if (!data) {
                return;
            }

            setSelectionState(({ selectedRowIds: currentSelectedRowIds }) => {
                if (currentSelectedRowIds.includes(id)) {
                    return {
                        allSelected: false,
                        selectedRowIds: currentSelectedRowIds.filter(
                            (rowId) => rowId !== id,
                        ),
                    };
                } else {
                    const newSelectedRowIds = [...currentSelectedRowIds, id];
                    return {
                        allSelected: data.length === newSelectedRowIds.length,
                        selectedRowIds: newSelectedRowIds,
                    };
                }
            });
        },
        [data],
    );

    useEffect(() => {
        setSelectionState({
            allSelected: false,
            selectedRowIds: [],
        });
    }, [data]);

    return {
        selectionColumn: {
            field: 'checkbox',
            sortable: false,
            filterable: false,
            hideable: false,
            editable: false,
            flex: 0,
            renderHeader() {
                return (
                    <Checkbox
                        onClick={handleSelectAll}
                        checked={selectionState.allSelected}
                    />
                );
            },
            renderCell({ row }) {
                return (
                    <Checkbox
                        checked={selectionState.selectedRowIds.includes(
                            row._id,
                        )}
                        onClick={(e) => handleCheckboxChange(e, row._id)}
                    />
                );
            },
        },
        selectedRowIds: selectionState.selectedRowIds,
    };
};
