import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
    gridFilterModelSelector,
    gridRowCountSelector,
    useGridApiContext,
    useGridSelector,
} from '@mui/x-data-grid';
import { useTranslate } from '../../i18n/I18NContext';
import { ConfirmPopup } from '../../lib/components/ConfirmPopup';
import { useDeleteFilteredAnnotation } from './hooks/useDeleteFilteredAnnotation';

export function DeleteFilteredButton() {
    const { translate } = useTranslate();
    const { mutateAsync, isLoading } = useDeleteFilteredAnnotation();

    const apiRef = useGridApiContext();
    const rowCount = useGridSelector(apiRef, gridRowCountSelector);
    const filters = useGridSelector(apiRef, gridFilterModelSelector);

    const filter = useMemo(() => {
        return filters?.items?.at(0);
    }, [filters]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setIsModalOpen(false);
    }, [filter]);

    const handleButtonClick = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        if (isLoading) {
            return;
        }

        setIsModalOpen(false);
    }, [isLoading]);

    const handleDelete = useCallback(async () => {
        try {
            // @ts-expect-error TS2345
            await mutateAsync({
                filterBy: filter?.columnField,
                filterOperator: filter?.operatorValue,
                filterValue: filter?.value,
            });

            apiRef.current.setFilterModel({
                items: [],
                // @ts-expect-error TS2322
                linkOperator: 'and',
            });
        } finally {
            setIsModalOpen(false);
        }
    }, [filter, mutateAsync, apiRef]);

    if (!filter?.value || rowCount === 0) {
        return null;
    }

    return (
        <>
            <Button
                onClick={handleButtonClick}
                variant="outlined"
                startIcon={<DeleteIcon />}
                color="primary"
                size="small"
            >
                {translate('annotation_delete_filtered_button_label')}
            </Button>
            <ConfirmPopup
                isOpen={isModalOpen}
                cancelLabel={translate('cancel')}
                confirmLabel={translate('delete')}
                title={translate('annotation_delete_filtered_modal_title')}
                onCancel={handleCloseModal}
                onConfirm={handleDelete}
                isLoading={isLoading}
            />
        </>
    );
}

DeleteFilteredButton.propTypes = {};
