import { Icon, IconButton, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useCallback } from 'react';
import compose from 'recompose/compose';
import { translate } from '../../../i18n/I18NContext';

import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

const SearchBar = ({
    className,
    p: polyglot,
    value,
    onChange,
    onClear,
    maxWidth,
}) => {
    const refTextField = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (refTextField.current) {
                refTextField.current.focus();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const handleChange = useCallback(
        (event) => {
            event.preventDefault();
            onChange(event);
        },
        [onChange],
    );

    const handleClear = useCallback(
        (event) => {
            event.preventDefault();
            event.stopPropagation();
            onClear();
        },
        [onClear],
    );

    const handleFocus = useCallback((event) => {
        if (event.target) {
            event.target.select();
        }
    }, []);

    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClear();
            }
        },
        [onClear],
    );

    return (
        <TextField
            fullWidth
            ref={refTextField}
            className={className}
            sx={{ maxWidth: maxWidth }}
            placeholder={polyglot.t('search')}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            value={value || ''}
            variant="outlined"
            InputProps={{
                startAdornment: (
                    <Icon sx={{ mr: 2 }}>
                        <SearchIcon />
                    </Icon>
                ),
                endAdornment: value && (
                    <IconButton
                        className="searchbar-clear"
                        title={polyglot.t('clear')}
                        onClick={handleClear}
                        size="small"
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

SearchBar.propTypes = {
    className: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    maxWidth: PropTypes.number,
};

SearchBar.defaultProps = {
    className: 'searchbar',
};

export default compose(translate)(SearchBar);
