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
import ClearAllIcon from '@mui/icons-material/ClearAll';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import ClearDialog from '../Appbar/ClearDialog';
import { publish } from './index';
import { useTranslate } from '../../../../src/app/js/i18n/I18NContext';

const options = [
    { label: 'republish', icon: <PublishedWithChangesIcon /> },
    { label: 'clear_publish', icon: <ClearAllIcon /> },
];

interface RepublishAndClearButtonComponentProps {
    onPublish(...args: unknown[]): unknown;
}

export const RepublishAndClearButtonComponent = ({
    onPublish,
}: RepublishAndClearButtonComponentProps) => {
    const { translate } = useTranslate();
    const [open, setOpen] = React.useState(false);
    const [showClearDialog, setShowClearDialog] = useState(false);

    const handleShowClearDialog = () => setShowClearDialog(true);
    const handleHideClearDialog = () => setShowClearDialog(false);

    const anchorRef = React.useRef();

    // @ts-expect-error TS7006
    const handleClick = (index) => {
        if (index === 1) {
            return handleShowClearDialog();
        }
        return onPublish();
    };

    // @ts-expect-error TS7006
    const handleMenuItemClick = (event, index) => {
        setOpen(false);
        handleClick(index);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    // @ts-expect-error TS7006
    const handleClose = (event) => {
        // @ts-expect-error TS2339
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
                // @ts-expect-error TS2769
                color="neutral"
            >
                <Button
                    onClick={() => handleClick(0)}
                    startIcon={options[0].icon}
                    size="small"
                >
                    {translate(options[0].label)}
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
                                                        {translate(
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

const mapStateToProps = () => ({});

const mapDispatchToProps = {
    onPublish: publish,
};

export const RepublishAndClearButton = compose(
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(RepublishAndClearButtonComponent);
