import React, { useState } from 'react';
import {
    Button,
    ButtonGroup,
    Popper,
    Grow,
    Paper,
    ClickAwayListener,
    MenuList,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import ClearDialog from '../Appbar/ClearDialog';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { publish } from '.';

const options = [
    { label: 'republish', icon: <PublishedWithChangesIcon /> },
    { label: 'clear_publish', icon: <ClearAllIcon /> },
];

export const RepublishAndClearButtonComponent = ({
    p: polyglot,
    onPublish,
}) => {
    const [open, setOpen] = React.useState(false);
    const [showClearDialog, setShowClearDialog] = useState(false);

    const handleShowClearDialog = () => setShowClearDialog(true);
    const handleHideClearDialog = () => setShowClearDialog(false);

    const anchorRef = React.useRef();

    const handleClick = (index) => {
        if (index === 1) {
            return handleShowClearDialog();
        }
        return onPublish();
    };

    const handleMenuItemClick = (event, index) => {
        setOpen(false);
        handleClick(index);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    return (
        <React.Fragment>
            <ButtonGroup
                variant="contained"
                ref={anchorRef}
                aria-label="add split button"
                size="small"
                sx={{
                    color: 'primary.main',
                    m: 1.5,
                }}
                color="neutral"
            >
                <Button
                    onClick={() => handleClick(0)}
                    startIcon={options[0].icon}
                    size="small"
                >
                    {polyglot.t(options[0].label)}
                </Button>
                <Button
                    size="small"
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select add strategy"
                    aria-haspopup="menu"
                    data-testid="add-field-dropdown"
                    onClick={handleToggle}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper
                style={{
                    zIndex: 9999999,
                }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom'
                                    ? 'center top'
                                    : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList autoFocusItem>
                                    {options.map((option, index) => {
                                        if (index !== 0) {
                                            return (
                                                <MenuItem
                                                    key={option.label}
                                                    onClick={(event) =>
                                                        handleMenuItemClick(
                                                            event,
                                                            index,
                                                        )
                                                    }
                                                >
                                                    <ListItemIcon>
                                                        {option.icon}
                                                    </ListItemIcon>
                                                    <ListItemText>
                                                        {polyglot.t(
                                                            option.label,
                                                        )}
                                                    </ListItemText>
                                                </MenuItem>
                                            );
                                        }
                                    })}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
            {showClearDialog && (
                <ClearDialog type="published" onClose={handleHideClearDialog} />
            )}
        </React.Fragment>
    );
};

RepublishAndClearButtonComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    onPublish: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
    onPublish: publish,
};

export const RepublishAndClearButton = compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(RepublishAndClearButtonComponent);
