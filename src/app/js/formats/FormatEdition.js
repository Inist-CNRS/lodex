import React from 'react';
import { FORMATS } from '../formats';
import {
    formField as formFieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../propTypes';
import { Box, Button, Typography } from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    ListAlt as ListAltIcon,
} from '@mui/icons-material';
import colorsTheme from '../../custom/colorsTheme';
import translate from 'redux-polyglot/translate';
import FormatCatalogDialog from './FormatCatalog';
import FormatEditionDialog from './FormatEditionDialog';

const FormatEdition = ({ p: polyglot, ...props }) => {
    const { input } = props;

    const formats = FORMATS.sort((x, y) =>
        polyglot.t(x.name).localeCompare(polyglot.t(y.name)),
    );

    const displayedName =
        FORMATS.find(format => format.componentName === input.value.name)
            ?.name || 'no_format';

    const [componentName, setComponentName] = React.useState(
        input.value.name || '',
    );
    const [openCatalog, setOpenCatalog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);

    React.useEffect(() => {
        setComponentName(input.value.name || '');
    }, [input.value.name]);

    const handleFormatChange = name => {
        setComponentName(name);
        setOpenCatalog(false);
        setOpenEditDialog(true);
    };

    const onEdit = () => {
        setOpenEditDialog(true);
    };
    const onRemove = () => {
        input.onChange(null);
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
                        backgroundColor: colorsTheme.black.veryLight,
                        '&:hover': {
                            backgroundColor: colorsTheme.black.lighter,
                        },
                    }}
                >
                    <Typography noWrap>{polyglot.t(displayedName)}</Typography>
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
                                    color: colorsTheme.orange.primary,
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
                            setComponentName(input.value.name || '');
                        }}
                        formats={formats}
                        input={input}
                        currentValue={componentName}
                    />
                )}
            </Box>
        </>
    );
};

FormatEdition.propTypes = {
    p: polyglotPropTypes.isRequired,
    ...formFieldPropTypes,
};

export default translate(FormatEdition);
