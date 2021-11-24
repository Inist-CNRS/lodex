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
import theme from '../../theme';
import { fromParsing } from '../selectors';
import ClearDialog from './ClearDialog';

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
    p: polyglot,
    dumpDataset,
    onSignOut,
    exportFields,
    hasLoadedDataset,
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
        callback && callback();
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
                    <MenuItem onClick={() => handleCloseMenu(exportFields)}>
                        {polyglot.t('export_fields')}
                    </MenuItem>
                    <MenuItem onClick={() => handleCloseMenu(dumpDataset)}>
                        {polyglot.t('export_raw_dataset')}
                    </MenuItem>
                    {hasLoadedDataset && (
                        <MenuItem
                            onClick={() =>
                                handleCloseMenu(() =>
                                    setShowClearDialog(!showClearDialog),
                                )
                            }
                        >
                            {polyglot.t('clear_dataset')}
                        </MenuItem>
                    )}
                    <Divider />
                    <MenuItem onClick={() => handleCloseMenu(onSignOut)}>
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
    p: polyglotPropTypes.isRequired,
    dumpDataset: PropTypes.func.isRequired,
    onSignOut: PropTypes.func.isRequired,
    exportFields: PropTypes.func.isRequired,
    hasLoadedDataset: PropTypes.bool,
};
const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            onSignOut: signOut,
            dumpDataset,
            exportFields,
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
