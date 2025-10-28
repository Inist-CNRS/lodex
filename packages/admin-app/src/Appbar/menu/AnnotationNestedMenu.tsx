import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import React, { useRef } from 'react';

import { useTranslate } from '../../../../../src/app/js/i18n/I18NContext';
import { useExportAnnotations } from '../../annotations/hooks/useExportAnnotations';
import { useGetAnnotations } from '../../annotations/hooks/useGetAnnotations';
import { useImportAnnotations } from '../../annotations/hooks/useImportAnnotations';

interface AnnotationNestedMenuProps {
    onClose(...args: unknown[]): unknown;
}

export const AnnotationNestedMenu = React.memo(function AnnotationNestedMenu({
    onClose,
}: AnnotationNestedMenuProps) {
    const { translate } = useTranslate();
    const fileInputRef = useRef(null);

    // @ts-expect-error TS2345
    const { data: annotations } = useGetAnnotations({
        page: 0,
    });

    const { exportAnnotations } = useExportAnnotations();
    const { importAnnotations } = useImportAnnotations();

    const handleExportAnnotations = () => {
        onClose(exportAnnotations);
    };

    const openAnnotationFileSelector = () => {
        // @ts-expect-error TS2339
        fileInputRef.current?.click();
    };

    // @ts-expect-error TS7006
    const handleAnnotationFileChange = (event) => {
        onClose(() => importAnnotations(event.target.files[0]));
    };

    return (
        <>
            <MenuItem onClick={openAnnotationFileSelector}>
                <ListItemIcon>
                    <AddIcon />
                </ListItemIcon>

                <ListItemText primary={translate('annotations_import')} />
            </MenuItem>

            <MenuItem
                onClick={handleExportAnnotations}
                disabled={!annotations?.total}
            >
                <ListItemIcon>
                    <GetAppIcon />
                </ListItemIcon>

                <ListItemText primary={translate('annotations_export')} />
            </MenuItem>
            <input
                name="import_annotations"
                type="file"
                ref={fileInputRef}
                onChange={handleAnnotationFileChange}
                style={{
                    position: 'absolute',
                    left: '-9999px',
                    top: '-9999px',
                }}
            />
        </>
    );
});
