import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Divider, IconButton } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { DEFAULT_TENANT } from '../../../../common/tools/tenantTools';
import { toast } from '../../../../common/tools/toast';
import { useTranslate } from '../../i18n/I18NContext';
import { signOut } from '../../user';
import ImportModelDialog from '../ImportModelDialog';
import { fromImport, fromPublication } from '../selectors';
import ClearDialog from './ClearDialog';
import ImportHasRelaunchDialog from './ImportHasRelaunchDialog';
import { AdvancedNestedMenu } from './menu/AdvancedNestedMenu';
import { AnnotationNestedMenu } from './menu/AnnotationNestedMenu';
import { ModelNestedMenu } from './menu/ModelNestedMenu';
import { NestedMenu } from './menu/NestedMenu';

const NESTED_MENU_ANNOTATIONS = 'annotations';
const NESTED_MENU_ADVANCED = 'advanced';
const NESTED_MENU_MODEL = 'model';

const MenuComponent = ({
    hasPublishedDataset,
    onSignOut,
    importSucceeded,
    importHasEnrichments,
    importHasPrecomputed,
    importFailed,
    history,
}) => {
    const { translate } = useTranslate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [subMenuToShow, setSubMenuToShow] = useState(null);

    const [showClearDialog, setShowClearDialog] = useState(false);
    const [clearDialogType, setClearDialogType] = useState(null);
    const [showImportFieldsConfirmation, setShowImportFieldsConfirmation] =
        useState(false);
    const [showRelaunchDialog, setShowRelaunchDialog] = useState(false);
    const [dataRelaunchDialog, setDataRelaunchDialog] = useState(null);

    useEffect(() => {
        if (importFailed) {
            toast(translate('import_fields_failed'), {
                type: toast.TYPE.ERROR,
            });
        } else if (importSucceeded) {
            toast(translate('model_imported_with_success'), {
                type: toast.TYPE.SUCCESS,
            });
        }
    }, [importSucceeded, importFailed]);

    useEffect(() => {
        if (importHasEnrichments || importHasPrecomputed) {
            setShowRelaunchDialog(true);
            setDataRelaunchDialog({
                hasEnrichments: importHasEnrichments,
                hasPrecomputed: importHasPrecomputed,
            });
        }
    }, [importHasEnrichments, importHasPrecomputed]);

    const open = !!anchorEl;

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = useCallback((callback) => {
        setAnchorEl(null);
        typeof callback === 'function' && callback();
    }, []);

    const handleCloseSubMenu = useCallback(() => {
        setSubMenuToShow(null);
    }, []);

    const onConfig = () => {
        history.push('/config');
    };

    const handleShowClearDialog = useCallback((type) => {
        setClearDialogType(type);
        setShowClearDialog(true);
    }, []);

    const showModelClearDialog = useCallback(() => {
        handleShowClearDialog('model');
    }, [handleShowClearDialog]);

    const showDatasetClearDialog = useCallback(() => {
        handleShowClearDialog('dataset');
    }, [handleShowClearDialog]);

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
                    aria-label={translate('open_menu')}
                    onClick={handleOpenMenu}
                >
                    <MoreVertIcon />
                </IconButton>

                <Menu
                    sx={{
                        display: 'flex',
                        '& > .MuiPaper-root': {
                            marginTop: '12px',
                            borderTopLeftRadius: '0',
                            borderTopRightRadius: '0',
                            overflow: 'visible',
                        },
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                >
                    <Box
                        sx={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            mb: 1,
                        }}
                    >
                        {sessionStorage.getItem('lodex-tenant') ||
                            DEFAULT_TENANT}
                    </Box>

                    <Divider />

                    <NestedMenu
                        isOpen={subMenuToShow === NESTED_MENU_MODEL}
                        onOpen={() => setSubMenuToShow(NESTED_MENU_MODEL)}
                        onClose={handleCloseSubMenu}
                        label={translate('model')}
                        menu={
                            <ModelNestedMenu
                                onClose={handleCloseMenu}
                                showModelClearDialog={showModelClearDialog}
                            />
                        }
                    />

                    <NestedMenu
                        isOpen={subMenuToShow === NESTED_MENU_ANNOTATIONS}
                        onOpen={() => setSubMenuToShow(NESTED_MENU_ANNOTATIONS)}
                        onClose={handleCloseSubMenu}
                        label={translate('annotations')}
                        menu={
                            <AnnotationNestedMenu onClose={handleCloseMenu} />
                        }
                    />

                    <NestedMenu
                        isOpen={subMenuToShow === NESTED_MENU_ADVANCED}
                        onOpen={() => setSubMenuToShow(NESTED_MENU_ADVANCED)}
                        onClose={handleCloseSubMenu}
                        label={translate('advanced')}
                        menu={
                            <AdvancedNestedMenu
                                onClose={handleCloseMenu}
                                showDatasetClearDialog={showDatasetClearDialog}
                            />
                        }
                    />

                    <Divider />
                    <MenuItem
                        onClick={() => handleCloseMenu(onConfig)}
                        aria-label={translate('config_tenant')}
                    >
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>

                        <ListItemText primary={translate('config_tenant')} />
                    </MenuItem>

                    <MenuItem
                        onClick={() => handleCloseMenu(onSignOut)}
                        aria-label={translate('sign_out')}
                        sx={{ color: 'danger.main' }}
                    >
                        <ListItemIcon sx={{ color: 'inherit' }}>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary={translate('sign_out')} />
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

            {showRelaunchDialog && (
                <ImportHasRelaunchDialog
                    onClose={() => setShowRelaunchDialog(false)}
                    data={dataRelaunchDialog}
                />
            )}
        </>
    );
};

MenuComponent.propTypes = {
    hasPublishedDataset: PropTypes.bool.isRequired,
    onSignOut: PropTypes.func.isRequired,
    importSucceeded: PropTypes.bool.isRequired,
    importHasEnrichments: PropTypes.bool.isRequired,
    importHasPrecomputed: PropTypes.bool.isRequired,
    importFailed: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
};
const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            onSignOut: signOut,
        },
        dispatch,
    );
const mapStateToProps = (state) => ({
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    importSucceeded: fromImport.hasImportSucceeded(state),
    importHasEnrichments: fromImport.hasEnrichments(state),
    importHasPrecomputed: fromImport.hasPrecomputed(state),
    importFailed: fromImport.hasImportFailed(state),
});
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter,
)(MenuComponent);
