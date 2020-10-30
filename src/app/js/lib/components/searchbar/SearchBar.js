import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';
import { IconButton, TextField, RootRef } from '@material-ui/core';
import { faSearch, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import stylesToClassname from '../../stylesToClassName';
import theme from '../../../theme';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

const styles = stylesToClassname(
    {
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        text: {
            flexGrow: 3,
            margin: '0px 8px',
        },
        searchIconContainer: {
            marginTop: '8px',
        },
        searchIcon: {
            color: theme.black.secondary,
        },
        clearIcon: {
            color: theme.orange.primary,
        },
        actions: {
            display: 'flex',
        },
    },
    'searchbar',
);

const muiStyles = {
    searchTextUnderline: {
        borderColor: theme.orange.primary,
    },
};

const SearchBar = ({
    className,
    p: polyglot,
    value,
    onChange,
    onClear,
    actions,
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
            <div className={styles.searchIconContainer}>
                <FontAwesomeIcon
                    className={styles.searchIcon}
                    icon={faSearch}
                    height={20}
                />
            </div>
            <RootRef rootRef={refTextField}>
                <TextField
                    className={styles.text}
                    placeholder={polyglot.t('search')}
                    onChange={onChange}
                    onFocus={event => {
                        event && event.target && event.target.select();
                    }}
                    value={value}
                    underlineStyle={muiStyles.searchTextUnderline}
                    underlineFocusStyle={muiStyles.searchTextUnderline}
                />
            </RootRef>
            <div className={styles.actions}>
                <IconButton
                    className="searchbar-clear"
                    tooltip={polyglot.t('clear')}
                    onClick={onClear}
                >
                    <FontAwesomeIcon
                        className={styles.clearIcon}
                        icon={faUndo}
                        height={20}
                    />
                </IconButton>
                {React.cloneElement(actions)}
            </div>
        </div>
    );
};

SearchBar.propTypes = {
    className: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    actions: PropTypes.element,
};

SearchBar.defaultProps = {
    className: 'searchbar',
};

export default compose(translate)(SearchBar);
