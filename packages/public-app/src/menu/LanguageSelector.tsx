import { useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import {
    translate,
    useTranslate,
} from '@lodex/frontend-common/i18n/I18NContext';
import { Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { setLanguage } from '@lodex/frontend-common/i18n';
import { fromI18n } from '@lodex/frontend-common/sharedSelectors';

type LanguageSelectorProps = {
    setLanguage(...args: unknown[]): unknown;
    locale: string;
};

const LanguageSelector = ({ locale, setLanguage }: LanguageSelectorProps) => {
    const { translate } = useTranslate();
    const [languageSelectorAnchorEl, setLanguageSelectorAnchorEl] =
        useState(null);
    const languageSelectorOpen = Boolean(languageSelectorAnchorEl);
    // @ts-expect-error TS7006
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
                {translate('semantic_language')}
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

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    locale: fromI18n.getLocale(state),
});

const mapDispatchToProps = {
    setLanguage,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
    // @ts-expect-error TS2345
)(LanguageSelector);
