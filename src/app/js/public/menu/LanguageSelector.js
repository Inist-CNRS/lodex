import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fromI18n } from '../selectors';
import { setLanguage } from '../../i18n';
import { Button, Menu, MenuItem } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const LanguageSelector = ({ locale, setLanguage }) => {
    const [languageSelectorAnchorEl, setLanguageSelectorAnchorEl] = useState(
        null,
    );
    const languageSelectorOpen = Boolean(languageSelectorAnchorEl);
    const handleLanguageSelectorClick = event => {
        setLanguageSelectorAnchorEl(event.currentTarget);
    };
    const handleLanguageSelectorClose = () => {
        setLanguageSelectorAnchorEl(null);
    };

    return (
        <>
            <Button
                aria-controls={
                    languageSelectorOpen ? 'language-selector-menu' : undefined
                }
                aria-haspopup="true"
                aria-expanded={languageSelectorOpen ? 'true' : undefined}
                startIcon={<LanguageIcon />}
                endIcon={<KeyboardArrowUpIcon />}
                onClick={handleLanguageSelectorClick}
            >
                {locale.toUpperCase()}
            </Button>
            <Menu
                id="language-selector-menu"
                anchorEl={languageSelectorAnchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={languageSelectorOpen}
                onClose={handleLanguageSelectorClose}
            >
                <MenuItem
                    onClick={() => {
                        setLanguage('en');
                        handleLanguageSelectorClose();
                    }}
                >
                    English
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setLanguage('fr');
                        handleLanguageSelectorClose();
                    }}
                >
                    Français
                </MenuItem>
            </Menu>
        </>
    );
};

LanguageSelector.propTypes = {
    setLanguage: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
    locale: fromI18n.getLocale(state),
});

const mapDispatchToProps = {
    setLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelector);
