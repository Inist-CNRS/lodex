import CloseIcon from '@mui/icons-material/Close';
import { Box, Drawer, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import { createContext, default as React, useCallback, useState } from 'react';

import { useTheme } from '@emotion/react';
import { useTranslate } from '../i18n/I18NContext';
import { AnnotationList } from './AnnotationList';
import { useGetFieldAnnotation } from './useGetFieldAnnotation';

const AnnotationContext = createContext({
    field: null,
    resourceUri: null,
    data: [],
    isLoading: false,
    error: null,
    openHistoryModal() {},
    loadAnnotations() {},
});

export function AnnotationContextProvider({ field, resourceUri, children }) {
    const theme = useTheme();
    const { translate } = useTranslate();

    const [forceLoadAnnotations, setForceLoadAnnotations] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const { data, isLoading, error } = useGetFieldAnnotation(
        field._id,
        resourceUri,
        isHistoryOpen || forceLoadAnnotations,
    );

    const openHistoryModal = useCallback(() => {
        setIsHistoryOpen(true);
    }, []);

    const closeHistoryModal = useCallback(() => {
        setIsHistoryOpen(false);
    }, []);

    const loadAnnotations = useCallback(() => {
        setForceLoadAnnotations(true);
    }, []);

    return (
        <AnnotationContext.Provider
            value={{
                openHistoryModal,
                loadAnnotations,
                field,
                resourceUri,
                data,
                isLoading,
                error,
            }}
        >
            {children}
            <Drawer
                anchor="right"
                open={isHistoryOpen}
                onClose={closeHistoryModal}
                sx={{
                    zIndex: '1399', // Have the drawer render on top of the modal preventing interaction with it
                }}
                PaperProps={{
                    sx: {
                        width: '40%',
                        minWidth: '600px',
                        backgroundColor: theme.palette.grey[100],
                    },
                }}
            >
                <Box display="flex" justifyContent="flex-start">
                    <IconButton
                        aria-label={translate('close')}
                        size="small"
                        onClick={closeHistoryModal}
                    >
                        <CloseIcon fontSize="1rem" />
                    </IconButton>
                </Box>

                {data && <AnnotationList annotations={data} field={field} />}
            </Drawer>
        </AnnotationContext.Provider>
    );
}

AnnotationContextProvider.propTypes = {
    field: PropTypes.object.isRequired,
    resourceUri: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export function useAnnotationContext() {
    return React.useContext(AnnotationContext);
}
