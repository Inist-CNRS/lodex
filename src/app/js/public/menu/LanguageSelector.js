import React, { useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromI18n } from '../selectors';
import { setLanguage } from '../../i18n';
import { Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const LanguageSelector = ({ locale, setLanguage, p: polyglot }) => {
    const [languageSelectorAnchorEl, setLanguageSelectorAnchorEl] =
        useState(null);
    const languageSelectorOpen = Boolean(languageSelectorAnchorEl);
    const handleLanguageSelectorClick = (event) => {
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
                endIcon={<KeyboardArrowUpIcon />}
                onClick={handleLanguageSelectorClick}
                sx={{
                    textTransform: 'none',
                    marginRight: 2,
                }}
            >
                {polyglot.t('semantic_language')}
                <br />
                {locale === 'fr' ? 'français' : 'english'}
            </Button>
            <Menu
                id="language-selector-menu"
                anchorEl={languageSelectorAnchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
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
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = (state) => ({
    locale: fromI18n.getLocale(state),
});

const mapDispatchToProps = {
    setLanguage,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(LanguageSelector);
