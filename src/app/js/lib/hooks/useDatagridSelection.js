import React, { useCallback, useEffect, useState } from 'react';
import { Checkbox } from '@mui/material';
import { useTranslate } from '../../i18n/I18NContext';

export const useDatagridSelection = (data) => {
    const { translate } = useTranslate();
    const [selectionState, setSelectionState] = useState({
        allSelected: false,
        selectedRows: [],
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
                    selectedRows: newAllSelected
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

            setSelectionState(({ selectedRows: currentSelectedRows }) => {
                if (currentSelectedRows.includes(id)) {
                    return {
                        allSelected: false,
                        selectedRows: currentSelectedRows.filter(
                            (rowId) => rowId !== id,
                        ),
                    };
                } else {
                    const newSelectedRows = [...currentSelectedRows, id];
                    return {
                        allSelected: data.length === newSelectedRows.length,
                        selectedRows: newSelectedRows,
                    };
                }
            });
        },
        [data],
    );

    useEffect(() => {
        setSelectionState({
            allSelected: false,
            selectedRows: [],
        });
    }, [data]);

    return {
        selectionColumn: {
            field: translate('checkbox'),
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
                        checked={selectionState.selectedRows.includes(row._id)}
                        onClick={(e) => handleCheckboxChange(e, row._id)}
                    />
                );
            },
        },
        selectedRows: selectionState.selectedRows,
    };
};
