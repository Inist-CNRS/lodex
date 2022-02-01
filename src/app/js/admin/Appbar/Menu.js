import React from 'react';
import PropTypes from 'prop-types';
import {
    IconButton,
    MenuItem,
    Menu,
    makeStyles,
    Divider,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import translate from 'redux-polyglot/translate';
import { compose } from 'recompose';
import { dumpDataset } from '../dump';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { signOut } from '../../user';
import { exportFields } from '../../exportFields';
import { fromParsing } from '../selectors';
import ClearDialog from './ClearDialog';
import jobsApi from '../api/job';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menu: {
        display: 'flex',
    },
});

const MenuComponent = ({
    dumpDataset,
    exportFields,
    hasLoadedDataset,
    onSignOut,
    p: polyglot,
}) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [showClearDialog, setShowClearDialog] = React.useState(false);
    const open = !!anchorEl;
    const handleOpenMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = callback => {
        setAnchorEl(null);
        typeof callback === 'function' && callback();
    };

    return (
        <>
            <div className={classes.container}>
                <IconButton
                    color="inherit"
                    aria-label="more"
                    onClick={handleOpenMenu}
                >
                    <MoreVert />
                </IconButton>
                <Menu
                    id="long-menu"
                    className={classes.menu}
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                    PaperProps={{
                        style: {
                            marginTop: '48px',
                            borderTopLeftRadius: '0',
                            borderTopRightRadius: '0',
                        },
                    }}
                >
                    {hasLoadedDataset && [
                        <MenuItem
                            key="export_fields"
                            onClick={() => handleCloseMenu(exportFields)}
                        >
                            {polyglot.t('export_fields')}
                        </MenuItem>,
                        <MenuItem
                            key="export_raw_dataset"
                            onClick={() => handleCloseMenu(dumpDataset)}
                        >
                            {polyglot.t('export_raw_dataset')}
                        </MenuItem>,
                        <MenuItem
                            key="clear_dataset"
                            onClick={() =>
                                handleCloseMenu(() =>
                                    setShowClearDialog(!showClearDialog),
                                )
                            }
                        >
                            {polyglot.t('clear_dataset')}
                        </MenuItem>,
                        <MenuItem
                            key="clear_jobs"
                            onClick={() => handleCloseMenu(jobsApi.clearJobs)}
                        >
                            {polyglot.t('clear_jobs')}
                        </MenuItem>,
                        <Divider key="divider" />,
                    ]}
                    <MenuItem
                        onClick={() => handleCloseMenu(onSignOut)}
                        aria-label="signout"
                    >
                        {polyglot.t('sign_out')}
                    </MenuItem>
                </Menu>
            </div>
            {showClearDialog && (
                <ClearDialog
                    type="dataset"
                    onClose={() => setShowClearDialog(!showClearDialog)}
                />
            )}
        </>
    );
};

MenuComponent.propTypes = {
    dumpDataset: PropTypes.func.isRequired,
    exportFields: PropTypes.func.isRequired,
    hasLoadedDataset: PropTypes.bool,
    hasPublishedDataset: PropTypes.bool,
    onSignOut: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};
const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            dumpDataset,
            exportFields,
            onSignOut: signOut,
        },
        dispatch,
    );
const mapStateToProps = state => ({
    hasLoadedDataset: fromParsing.hasUploadedFile(state),
});
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(MenuComponent);
