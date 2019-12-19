import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import { faSearch, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import stylesToClassname from '../stylesToClassName';
import theme from '../../theme';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = stylesToClassname(
    {
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        searchText: {
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
    },
    'search',
);

const muiStyles = {
    searchTextUnderline: {
        borderColor: theme.orange.primary,
    },
};

const SearchBar = ({ p: polyglot, value, onChange, onClear, actions }) => {
    return (
        <div className={classnames('search-bar', styles.container)}>
            <div
                className={classnames(
                    'search-icon-container',
                    styles.searchIconContainer,
                )}
            >
                <FontAwesomeIcon
                    className={styles.searchIcon}
                    icon={faSearch}
                    height={20}
                />
            </div>
            <TextField
                className={classnames('search-text', styles.searchText)}
                hintText={polyglot.t('search')}
                onChange={onChange}
                value={value}
                underlineStyle={muiStyles.searchTextUnderline}
                underlineFocusStyle={muiStyles.searchTextUnderline}
            />
            <div className="search-advanced">
                <IconButton
                    className="search-clear"
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
    p: polyglotPropTypes.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    actions: PropTypes.element,
};

export default compose(translate)(SearchBar);
