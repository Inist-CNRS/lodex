import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    IconButton,
    MenuItem,
    Menu,
    Divider,
    Fade,
    MenuList,
    Paper,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import StorageIcon from '@mui/icons-material/Storage';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import translate from 'redux-polyglot/translate';
import { compose } from 'recompose';
import { dumpDataset } from '../dump';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { signOut } from '../../user';
import { exportFields } from '../../exportFields';
import { fromParsing, fromPublication, fromImport } from '../selectors';
import { fromFields } from '../../sharedSelectors';
import { importFields } from '../import';
import ClearDialog from './ClearDialog';
import jobsApi from '../api/job';
import { toast } from 'react-toastify';
import ImportModelDialog from '../ImportModelDialog';
import ImportHasEnrichmentsDialog from './ImportHasEnrichmentsDialog';

const MenuComponent = ({
    dumpDataset,
    exportFields,
    hasLoadedDataset,
    hasPublishedDataset,
    onSignOut,
    importFields,
    nbFields,
    importSucceeded,
    importHasEnrichment,
    importFailed,
    p: polyglot,
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [subMenuToShow, setSubMenuToShow] = useState(null);

    const [showClearDialog, setShowClearDialog] = useState(false);
    const [clearDialogType, setClearDialogType] = useState(null);
    const [
        showImportFieldsConfirmation,
        setShowImportFieldsConfirmation,
    ] = useState(false);
    const [
        showImportedFieldsHasEnrichmentsDialog,
        setShowImportedFieldsHasEnrichmentsDialog,
    ] = useState(false);

    const [applyUploadInput, setApplyUploadInput] = useState(false);

    useEffect(() => {
        if (importFailed) {
            toast(polyglot.t('import_fields_failed'), {
                type: toast.TYPE.ERROR,
                autoClose: false,
            });
        } else if (importSucceeded) {
            toast(polyglot.t('model_imported_with_success'), {
                type: toast.TYPE.SUCCESS,
            });
        }
    }, [importSucceeded, importFailed]);

    useEffect(() => {
        if (nbFields === 0) {
            setApplyUploadInput(true);
        } else {
            setApplyUploadInput(false);
        }
    }, [nbFields]);

    useEffect(() => {
        if (importHasEnrichment) {
            setShowImportedFieldsHasEnrichmentsDialog(true);
        }
    }, [importHasEnrichment]);

    const open = !!anchorEl;

    const handleOpenMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = callback => {
        setAnchorEl(null);
        typeof callback === 'function' && callback();
    };

    const handleOpenModelMenu = () => {
        setSubMenuToShow('model');
    };

    const handleOpenAdvancedMenu = () => {
        setSubMenuToShow('advanced');
    };

    const handleCloseSubMenu = () => {
        setSubMenuToShow(null);
    };

    const handleClearJobs = async () => {
        const result = await jobsApi.clearJobs();
        if (result.response.status === 'success') {
            toast(polyglot.t('jobs_cleared'), {
                type: toast.TYPE.SUCCESS,
            });
        }
        setAnchorEl(null);
    };

    const handleImportFieldsClick = () => {
        if (!applyUploadInput) {
            setShowImportFieldsConfirmation(true);
            handleCloseMenu();
        }
    };

    const modelMenuItems = [
        <div
            key="import_fields"
            title={hasPublishedDataset && polyglot.t('import_model_published')}
        >
            <MenuItem
                onClick={handleImportFieldsClick}
                disabled={hasPublishedDataset || !hasLoadedDataset}
            >
                <AddIcon />
                <Box component="span" ml={1}>
                    {polyglot.t('import_fields')}
                    {applyUploadInput && (
                        <input
                            name="file_model"
                            type="file"
                            onChange={event =>
                                handleCloseMenu(
                                    importFields(event.target.files[0]),
                                )
                            }
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                opacity: 0,
                                width: '100%',
                                cursor: 'pointer',
                                fontSize: 0,
                            }}
                        />
                    )}
                </Box>
            </MenuItem>
        </div>,
        <MenuItem
            key="export_fields"
            onClick={() => handleCloseMenu(exportFields)}
            disabled={!hasLoadedDataset}
        >
            <AspectRatioIcon />
            <Box component="span" ml={1}>
                {polyglot.t('export_fields')}
            </Box>
        </MenuItem>,
        <MenuItem
            key="clear_model"
            onClick={() =>
                handleCloseMenu(() => {
                    setClearDialogType('model');
                    setShowClearDialog(!showClearDialog);
                })
            }
            disabled={!hasLoadedDataset}
        >
            <ClearAllIcon />
            <Box component="span" ml={1}>
                {polyglot.t('clear_model')}
            </Box>
        </MenuItem>,
    ];

    const advancedMenuItems = [
        <MenuItem
            key="export_raw_dataset"
            onClick={() => handleCloseMenu(dumpDataset)}
            disabled={!hasLoadedDataset}
        >
            <StorageIcon />
            <Box component="span" ml={1}>
                {polyglot.t('export_raw_dataset')}
            </Box>
        </MenuItem>,
        <MenuItem
            key="clear_dataset"
            onClick={() =>
                handleCloseMenu(() => {
                    setClearDialogType('dataset');
                    setShowClearDialog(!showClearDialog);
                })
            }
            disabled={!hasLoadedDataset}
        >
            <ClearAllIcon />
            <Box component="span" ml={1}>
                {polyglot.t('clear_dataset')}
            </Box>
        </MenuItem>,
        <MenuItem key="clear_jobs" onClick={handleClearJobs}>
            <DeleteSweepIcon />
            <Box component="span" ml={1}>
                {polyglot.t('clear_jobs')}
            </Box>
        </MenuItem>,
    ];

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <IconButton
                    color="inherit"
                    aria-label="Open menu"
                    onClick={handleOpenMenu}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    sx={{
                        display: 'flex',
                        '& > .MuiPaper-root': {
                            marginTop: '12px',
                            borderTopLeftRadius: '0',
                            borderTopRightRadius: '0',
                            overflow: 'visible',
                        },
                    }}
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                >
                    <Box
                        onMouseEnter={handleOpenModelMenu}
                        onMouseLeave={handleCloseSubMenu}
                        sx={{
                            position: 'relative',
                        }}
                    >
                        <MenuItem
                            sx={{
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box component="span" mr={1}>
                                {polyglot.t('model')}
                            </Box>
                            <ChevronRightIcon />
                        </MenuItem>
                        <Fade in={subMenuToShow === 'model'}>
                            <Paper
                                elevation={8}
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    transform: 'translateX(-100%)',
                                }}
                            >
                                <MenuList>{modelMenuItems}</MenuList>
                            </Paper>
                        </Fade>
                    </Box>
                    <Box
                        onMouseEnter={handleOpenAdvancedMenu}
                        onMouseLeave={handleCloseSubMenu}
                        sx={{
                            position: 'relative',
                        }}
                    >
                        <MenuItem
                            sx={{
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box component="span" mr={1}>
                                {polyglot.t('advanced')}
                            </Box>
                            <ChevronRightIcon />
                        </MenuItem>
                        <Fade in={subMenuToShow === 'advanced'}>
                            <Paper
                                elevation={8}
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    transform: 'translateX(-100%)',
                                }}
                            >
                                <MenuList>{advancedMenuItems}</MenuList>
                            </Paper>
                        </Fade>
                    </Box>
                    <Divider />
                    <MenuItem
                        onClick={() => handleCloseMenu(onSignOut)}
                        aria-label="signout"
                    >
                        <ExitToAppIcon />
                        <Box component="span" ml={1}>
                            {polyglot.t('sign_out')}
                        </Box>
                    </MenuItem>
                </Menu>
            </Box>
            {showClearDialog && (
                <ClearDialog
                    type={clearDialogType}
                    onClose={() => setShowClearDialog(!showClearDialog)}
                />
            )}
            {!hasPublishedDataset && showImportFieldsConfirmation && (
                <ImportModelDialog
                    onClose={() => setShowImportFieldsConfirmation(false)}
                />
            )}
            {showImportedFieldsHasEnrichmentsDialog && (
                <ImportHasEnrichmentsDialog
                    onClose={() =>
                        setShowImportedFieldsHasEnrichmentsDialog(false)
                    }
                />
            )}
        </>
    );
};

MenuComponent.propTypes = {
    dumpDataset: PropTypes.func.isRequired,
    exportFields: PropTypes.func.isRequired,
    hasLoadedDataset: PropTypes.bool.isRequired,
    hasPublishedDataset: PropTypes.bool.isRequired,
    onSignOut: PropTypes.func.isRequired,
    importFields: PropTypes.func.isRequired,
    nbFields: PropTypes.number.isRequired,
    importSucceeded: PropTypes.bool.isRequired,
    importHasEnrichment: PropTypes.bool.isRequired,
    importFailed: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};
const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            dumpDataset,
            exportFields,
            onSignOut: signOut,
            importFields,
        },
        dispatch,
    );
const mapStateToProps = state => ({
    hasLoadedDataset: fromParsing.hasUploadedFile(state),
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    nbFields: fromFields.getAllListFields(state).filter(f => f.name !== 'uri')
        .length,
    importSucceeded: fromImport.hasImportSucceeded(state),
    importHasEnrichment: fromImport.hasEnrichment(state),
    importFailed: fromImport.hasImportFailed(state),
});
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(MenuComponent);
