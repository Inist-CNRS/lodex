import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Menu, Button, MenuItem } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import stylesToClassname from '../../lib/stylesToClassName';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { ArrowUpward } from '@mui/icons-material';
import translate from 'redux-polyglot/translate';

const styles = stylesToClassname(
    {
        menuContainer: {
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1003, // on top of Navbar (with zIndex 1002)
        },
        menuTitle: {
            padding: '0px 16px',
            margin: '0px',
        },
        menuList: {
            padding: '0px 24px',
            margin: '0px',
        },
    },
    'export',
);

export const getSortableFieldNames = fieldNames =>
    [
        fieldNames.title,
        fieldNames.description,
        fieldNames.detail1,
        fieldNames.detail2,
        fieldNames.detail3,
    ].filter(x => !!x);

export const getSortableFields = (fields, sortedFieldNames) =>
    fields
        .filter(field => sortedFieldNames.includes(field.name) && field.label)
        .sort(
            (fieldA, fieldB) =>
                sortedFieldNames.indexOf(fieldA.name) -
                sortedFieldNames.indexOf(fieldB.name),
        );

const SearchResultSort = ({
    p: polyglot,
    fields,
    fieldNames,
    sort,
    sortBy,
    sortDir,
}) => {
    const [popover, setPopover] = useState({ open: false });
    const sortableFieldNames = getSortableFieldNames(fieldNames);
    const sortableFields = getSortableFields(fields, sortableFieldNames);

    const handleSort = name => {
        sort({ sortBy: name });
    };

    const handleOpen = event => {
        // This prevents ghost click.
        event.preventDefault();

        setPopover({
            open: true,
            anchorEl: event.currentTarget,
        });
    };

    const handleClose = () => {
        setPopover({
            open: false,
        });
    };

    return (
        <>
            <Button
                variant="text"
                onClick={handleOpen}
                className="export"
                startIcon={<SortIcon />}
                endIcon={<ArrowDropDownIcon />}
            >
                {sortBy
                    ? polyglot.t('sort_search_by_field', {
                          field: sortableFields.find(s => s.name === sortBy)
                              ?.label,
                      })
                    : polyglot.t('sort_search')}{' '}
                {sortDir && polyglot.t(sortDir.toLowerCase())}
            </Button>
            <div className={styles.menuContainer}>
                <Menu
                    className={styles.menuList}
                    anchorEl={popover.anchorEl}
                    keepMounted
                    open={popover.open}
                    onClose={handleClose}
                >
                    <h3 className={styles.menuTitle}>Trier les resulats</h3>
                    {sortableFields.map(field => (
                        <MenuItem
                            key={field.name}
                            onClick={() => handleSort(field.name)}
                        >
                            {field.label}
                            {sortBy === field.name && (
                                <ArrowUpward
                                    sx={
                                        sortDir === 'DESC'
                                            ? { transform: 'rotate(180deg)' }
                                            : {}
                                    }
                                />
                            )}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        </>
    );
};

SearchResultSort.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    fieldNames: PropTypes.shape({
        uri: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        detail1: PropTypes.string,
        detail2: PropTypes.string,
        detail3: PropTypes.string,
    }).isRequired,
    sortBy: PropTypes.string,
    sortDir: PropTypes.oneOf(['ASC', 'DESC']),
    sort: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(SearchResultSort);
