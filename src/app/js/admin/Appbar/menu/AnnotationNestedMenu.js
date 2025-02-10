import GetAppIcon from '@mui/icons-material/GetApp';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import React from 'react';

import { useTranslate } from '../../../i18n/I18NContext';
import { useExportAnnotations } from '../../annotations/hooks/useExportAnnotations';
import { useGetAnnotations } from '../../annotations/hooks/useGetAnnotations';

export const AnnotationNestedMenu = React.memo(function AnnotationNestedMenu({
    onClose,
}) {
    const { translate } = useTranslate();

    const { data: annotations } = useGetAnnotations({
        page: 0,
    });

    const { exportAnnotations } = useExportAnnotations();

    const handleExportAnnotations = () => {
        onClose(exportAnnotations);
    };

    return (
        <>
            <MenuItem
                key="annotations_export"
                onClick={handleExportAnnotations}
                disabled={!annotations?.total}
            >
                <ListItemIcon>
                    <GetAppIcon />
                </ListItemIcon>

                <ListItemText primary={translate('annotations_export')} />
            </MenuItem>
        </>
    );
});

AnnotationNestedMenu.propTypes = {
    onClose: PropTypes.func.isRequired,
};
