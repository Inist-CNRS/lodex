import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import AddFromDatasetIcon from '../Appbar/AddFromDatasetIcon';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

import { connect } from 'react-redux';
import { Add } from '@mui/icons-material';
import { ListItemIcon, ListItemText } from '@mui/material';
import { showAddFromColumn } from '../parsing';
import { fromFields } from '../../../../src/app/js/sharedSelectors';
import { addField } from '../../../../src/app/js/fields/reducer';
import { SCOPE_DOCUMENT } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

const options = [
    { label: 'new_field', icon: <Add /> },
    { label: 'blank_field', icon: <Add /> },
    { label: 'from_original_dataset', icon: <AddFromDatasetIcon /> },
];

interface FieldAddDropdownButtonComponentProps {
    onAddNewField(...args: unknown[]): unknown;
    onShowExistingColumns(...args: unknown[]): unknown;
    isFieldsLoading?: boolean;
    subresourceId?: string;
}

export const FieldAddDropdownButtonComponent = ({
    onAddNewField,

    onShowExistingColumns,

    isFieldsLoading,

    subresourceId,
}: FieldAddDropdownButtonComponentProps) => {
    const { translate } = useTranslate();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef();

    // @ts-expect-error TS7006
    const handleClick = (index) => {
        if (index === 2) {
            return onShowExistingColumns();
        }
        return onAddNewField({ scope: SCOPE_DOCUMENT, subresourceId });
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
            {/*
             // @ts-expect-error TS2769 */}
            <ButtonGroup
                variant="contained"
                ref={anchorRef}
                aria-label="add split button"
                disabled={isFieldsLoading}
            >
                <Button
                    onClick={() => handleClick(0)}
                    startIcon={options[0].icon}
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
        </React.Fragment>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    isFieldsLoading: fromFields.isLoading(state),
});

const mapDispatchToProps = {
    onShowExistingColumns: showAddFromColumn,
    onAddNewField: addField,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FieldAddDropdownButtonComponent);
