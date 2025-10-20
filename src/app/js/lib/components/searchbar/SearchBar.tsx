import { Icon, IconButton, TextField } from '@mui/material';
// @ts-expect-error TS6133
import React, { useEffect, useRef } from 'react';
import compose from 'recompose/compose';
import { translate } from '../../../i18n/I18NContext';

import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material';

interface SearchBarProps {
    className: string;
    p: any;
    value: string;
    onChange(...args: unknown[]): unknown;
    onClear(...args: unknown[]): unknown;
    maxWidth?: number;
}

const SearchBar = ({
    className,

    p: polyglot,

    value,

    onChange,

    onClear,

    maxWidth,
}: SearchBarProps) => {
    const refTextField = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            if (!refTextField?.current) {
                return;
            }

            // @ts-expect-error TS2531
            refTextField.current.focus();
        }, 300);
    }, [refTextField]);

    return (
        <TextField
            fullWidth
            ref={refTextField}
            className={className}
            sx={{ maxWidth: maxWidth }}
            placeholder={polyglot.t('search')}
            onChange={onChange}
            onFocus={(event) => {
                if (!event || !event.target) {
                    return;
                }
                event.target.select();
            }}
            value={value}
            variant="outlined"
            InputProps={{
                startAdornment: (
                    <Icon sx={{ mr: 2 }}>
                        <SearchIcon />
                    </Icon>
                ),

                endAdornment: (
                    <IconButton
                        className="searchbar-clear"
                        title={polyglot.t('clear')}
                        onClick={onClear}
                    >
                        <Icon>
                            <ClearIcon />
                        </Icon>
                    </IconButton>
                ),
            }}
        />
    );
};

SearchBar.defaultProps = {
    className: 'searchbar',
};

// @ts-expect-error TS2345
export default compose(translate)(SearchBar);
