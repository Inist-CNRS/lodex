import { Icon, IconButton, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import compose from 'recompose/compose';
import { translate } from '../../../i18n/I18NContext';

import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

const SearchBar = ({
    // @ts-expect-error TS7031
    className,
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    value,
    // @ts-expect-error TS7031
    onChange,
    // @ts-expect-error TS7031
    onClear,
    // @ts-expect-error TS7031
    maxWidth,
}) => {
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

// @ts-expect-error TS2345
export default compose(translate)(SearchBar);
