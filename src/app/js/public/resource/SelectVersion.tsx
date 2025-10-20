import { useState } from 'react';
import { Menu, MenuItem, Button } from '@mui/material';
import { connect } from 'react-redux';
import moment from 'moment';
import compose from 'recompose/compose';
import ArrowDown from '@mui/icons-material/KeyboardArrowDown';

import { selectVersion } from '../resource';
import { fromResource } from '../selectors';
import { useTranslate } from '../../i18n/I18NContext';

// @ts-expect-error TS7006
const getFormat = (latest, length) => (dateString, index) =>
    `${moment(dateString).format('L HH:mm:ss')}${
        index === length - 1 ? ` (${latest})` : ''
    }`;

interface SelectVersionProps {
    versions: string[];
    onSelectVersion(...args: unknown[]): unknown;
    selectedVersion: number;
}

export const SelectVersionComponent = ({
    versions,
    onSelectVersion,
    selectedVersion,
}: SelectVersionProps) => {
    const { translate } = useTranslate();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [showMenu, setShowMenu] = useState(false);

    // @ts-expect-error TS7006
    const getMenuItems = (versions, format) =>
        // @ts-expect-error TS7006
        versions.map((date, index) => (
            <MenuItem
                key={date}
                className={`version version_${index}`}
                value={index}
            >
                {format(date, index)}
            </MenuItem>
        ));

    // @ts-expect-error TS7006
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setShowMenu(true);
    };

    // @ts-expect-error TS7006
    const handleVersionClick = (event, value) => {
        setShowMenu(false);
        onSelectVersion(value);
    };

    const handleRequestClose = () => {
        setShowMenu(false);
    };

    const format = getFormat(translate('latest'), versions.length);

    return (
        <div>
            <Button
                variant="text"
                className="select-version"
                onClick={handleClick}
                endIcon={<ArrowDown />}
            >
                {format(versions[selectedVersion], selectedVersion)}
            </Button>
            <Menu
                // @ts-expect-error TS2322
                onChange={handleVersionClick}
                anchorEl={anchorEl}
                keepMounted
                open={showMenu}
                onClose={handleRequestClose}
            >
                {getMenuItems(versions, format)}
            </Menu>
        </div>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    versions: fromResource.getVersions(state),
    selectedVersion: fromResource.getSelectedVersion(state),
});

const mapDispatchToProps = {
    onSelectVersion: selectVersion,
};

export default compose<
    SelectVersionProps,
    Omit<SelectVersionProps, 'versions' | 'selectedVersion' | 'onSelectVersion'>
>(connect(mapStateToProps, mapDispatchToProps))(SelectVersionComponent);
