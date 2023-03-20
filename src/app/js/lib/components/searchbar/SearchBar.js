import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';
import { Icon, IconButton, TextField } from '@mui/material';

import stylesToClassname from '../../stylesToClassName';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import customTheme from '../../../../custom/customTheme';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

const styles = stylesToClassname(
    {
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        text: {
            flexGrow: 3,
            margin: '0px 8px',
        },
        searchIcon: {
            color: customTheme.palette.neutralDark.secondary,
        },
        clearIcon: {
            color: customTheme.palette.secondary.main,
        },
        actions: {
            display: 'flex',
        },
    },
    'searchbar',
);

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
        setTimeout(() => {
            refTextField &&
                refTextField.current &&
                refTextField.current.focus();
        }, 300);
    }, [refTextField]);

    return (
        <div className={classnames(className, styles.container)}>
            <TextField
                ref={refTextField}
                className={styles.text}
                sx={{ maxWidth: maxWidth }}
                placeholder={polyglot.t('search')}
                onChange={onChange}
                onFocus={event => {
                    event && event.target && event.target.select();
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
        </div>
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
