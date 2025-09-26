import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SortIcon from '@mui/icons-material/Sort';
import { Button, Menu, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { ArrowUpward } from '@mui/icons-material';
import { translate } from '../../i18n/I18NContext';
import stylesToClassname from '../../lib/stylesToClassName';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';

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
    'sort',
);

// @ts-expect-error TS7006
export const getSortableFieldNames = (fieldNames) =>
    [
        fieldNames.title,
        fieldNames.description,
        fieldNames.detail1,
        fieldNames.detail2,
        fieldNames.detail3,
    ].filter((x) => !!x);

// @ts-expect-error TS7006
export const getSortableFields = (fields, sortedFieldNames) =>
    fields
        // @ts-expect-error TS7006
        .filter((field) => sortedFieldNames.includes(field.name) && field.label)
        .sort(
            // @ts-expect-error TS7006
            (fieldA, fieldB) =>
                sortedFieldNames.indexOf(fieldA.name) -
                sortedFieldNames.indexOf(fieldB.name),
        );

const SearchResultSort = ({
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    fields,
    // @ts-expect-error TS7031
    fieldNames,
    // @ts-expect-error TS7031
    sort,
    // @ts-expect-error TS7031
    sortBy,
    // @ts-expect-error TS7031
    sortDir,
}) => {
    const [popover, setPopover] = useState({ open: false });
    const sortableFieldNames = getSortableFieldNames(fieldNames);
    const sortableFields = getSortableFields(fields, sortableFieldNames);

    // @ts-expect-error TS7006
    const handleSort = (name) => {
        sort({ sortBy: name });
        setPopover({
            open: false,
        });
    };

    // @ts-expect-error TS7006
    const handleOpen = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        setPopover({
            open: true,
            // @ts-expect-error TS2353
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
                className="sort-button"
                startIcon={<SortIcon />}
                endIcon={<ArrowDropDownIcon />}
            >
                {sortBy
                    ? polyglot.t('sort_search_by_field', {
                          // @ts-expect-error TS7006
                          field: sortableFields.find((s) => s.name === sortBy)
                              ?.label,
                      })
                    : polyglot.t('sort_search')}{' '}
                {sortDir && ` | ${polyglot.t(sortDir.toLowerCase())}`}
            </Button>
            {/*
             // @ts-expect-error TS2339 */}
            <div className={styles.menuContainer}>
                <Menu
                    // @ts-expect-error TS2339
                    className={styles.menuList}
                    // @ts-expect-error TS2339
                    anchorEl={popover.anchorEl}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    open={popover.open}
                    onClose={handleClose}
                >
                    {/*
                     // @ts-expect-error TS2339 */}
                    <h3 className={styles.menuTitle}>
                        {polyglot.t('sort_search_title')}
                    </h3>
                    {/*
                     // @ts-expect-error TS7006 */}
                    {sortableFields.map((field) => (
                        // @ts-expect-error TS2769
                        <MenuItem
                            key={field.name}
                            onClick={() => handleSort(field.name)}
                            aria-current={sortBy === field.name ? 'true' : null}
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
                    {sortBy && (
                        <MenuItem
                            onClick={() => handleSort('')}
                            sx={{
                                color: 'warning.main',
                            }}
                        >
                            {polyglot.t('no_sort_search')}
                        </MenuItem>
                    )}
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
