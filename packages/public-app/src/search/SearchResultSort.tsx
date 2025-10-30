import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SortIcon from '@mui/icons-material/Sort';
import { Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

import { ArrowUpward } from '@mui/icons-material';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import stylesToClassname from '../../../../src/app/js/lib/stylesToClassName';
import type { Field } from '../../../../src/app/js/fields/types';

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

type SearchResultSortProps = {
    fields: Field[];
    fieldNames: {
        uri?: string;
        title?: string;
        description?: string;
        detail1?: string;
        detail2?: string;
        detail3?: string;
    };
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
    sort(value: { sortBy: string }): void;
};

const SearchResultSort = ({
    fields,
    fieldNames,
    sort,
    sortBy,
    sortDir,
}: SearchResultSortProps) => {
    const [popover, setPopover] = useState({ open: false });
    const sortableFieldNames = getSortableFieldNames(fieldNames);
    const sortableFields = getSortableFields(fields, sortableFieldNames);
    const { translate } = useTranslate();

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
                    ? translate('sort_search_by_field', {
                          // @ts-expect-error TS7006
                          field: sortableFields.find((s) => s.name === sortBy)
                              ?.label,
                      })
                    : translate('sort_search')}{' '}
                {sortDir && ` | ${translate(sortDir.toLowerCase())}`}
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
                        {translate('sort_search_title')}
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
                            {translate('no_sort_search')}
                        </MenuItem>
                    )}
                </Menu>
            </div>
        </>
    );
};

export default SearchResultSort;
