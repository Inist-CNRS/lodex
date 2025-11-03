import React from 'react';
import { FORMATS } from './getFormat';
import { Box, Button, Typography } from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    ListAlt as ListAltIcon,
} from '@mui/icons-material';
import FormatCatalogDialog from './FormatCatalog';
import FormatEditionDialog from './FormatEditionDialog';
import { useTranslate } from '../i18n/I18NContext';
import { useController, useFormContext } from 'react-hook-form';

const FormatEdition = () => {
    const { translate } = useTranslate();

    const { control } = useFormContext();
    const { field } = useController({
        name: 'format',
        control,
    });

    const formats = FORMATS.sort((x, y) =>
        translate(x.name).localeCompare(translate(y.name)),
    );

    const displayedName =
        FORMATS.find((format) => format.componentName === field.value?.name)
            ?.name || 'no_format';

    const [componentName, setComponentName] = React.useState(
        field.value?.name || '',
    );
    const [openCatalog, setOpenCatalog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);

    React.useEffect(() => {
        setComponentName(field.value?.name || '');
    }, [field.value?.name]);

    // @ts-expect-error TS7006
    const handleFormatChange = (name) => {
        setComponentName(name);
        setOpenCatalog(false);
        setOpenEditDialog(true);
    };

    const onEdit = () => {
        setOpenEditDialog(true);
    };
    const onRemove = () => {
        field.onChange(null);
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexGrow: 1,
                        padding: 1,
                        borderRadius: 1,
                        backgroundColor: 'var(--neutral-dark-very-light)',
                        '&:hover': {
                            backgroundColor: 'var(--neutral-dark-lighter)',
                        },
                    }}
                >
                    <Typography noWrap>{translate(displayedName)}</Typography>
                    {componentName && (
                        <Box
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <EditIcon
                                aria-label={`format-edit`}
                                sx={{ cursor: 'pointer' }}
                                onClick={() => onEdit()}
                            />
                            <DeleteIcon
                                aria-label={`format-delete`}
                                sx={{
                                    cursor: 'pointer',
                                    color: 'warning.main',
                                }}
                                onClick={() => {
                                    onRemove();
                                }}
                            />
                        </Box>
                    )}
                </Box>
                <Box sx={{ marginLeft: '10px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenCatalog(true)}
                        sx={{ height: '100%' }}
                        data-testid="open-format-catalog"
                    >
                        <ListAltIcon fontSize="small" />
                    </Button>
                </Box>
                <FormatCatalogDialog
                    isOpen={openCatalog}
                    handleClose={() => setOpenCatalog(false)}
                    formats={formats}
                    onChange={handleFormatChange}
                    currentValue={componentName}
                />
                {openEditDialog && (
                    <FormatEditionDialog
                        isOpen={openEditDialog}
                        handleClose={() => {
                            setOpenEditDialog(false);
                            setComponentName(field.value?.name || '');
                        }}
                        formats={formats}
                        field={field}
                        currentValue={componentName}
                    />
                )}
            </Box>
        </>
    );
};

export default FormatEdition;
