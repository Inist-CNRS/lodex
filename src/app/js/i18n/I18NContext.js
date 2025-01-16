import React, { createContext, useContext } from 'react';
import Polyglot from 'node-polyglot';
import { fromI18n } from '../public/selectors';
import { connect } from 'react-redux';
import { setLanguage as setLanguageAction } from './index';
import PropTypes from 'prop-types';

const I18NContext = createContext({ translate: () => '' });

export const I18NComponent = ({ locale, phrases, setLanguage, children }) => {
    const polyglot = new Polyglot({
        locale,
        phrases,
    });

    const translate = polyglot.t.bind(polyglot);
    return (
        <I18NContext.Provider value={{ translate, locale, setLanguage }}>
            {children}
        </I18NContext.Provider>
    );
};

I18NComponent.propTypes = {
    locale: PropTypes.oneOf(['fr', 'en']).isRequired,
    phrases: PropTypes.array.isRequired,
    setLanguage: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

const mapStateToProps = (state) => ({
    phrases: fromI18n.getPhrases(state),
    locale: fromI18n.getLocale(state),
});

const mapDispatchToProps = {
    setLanguage: setLanguageAction,
};

export const I18N = connect(mapStateToProps, mapDispatchToProps)(I18NComponent);
export const TestI18N = ({ children }) => {
    return (
        <I18NContext.Provider
            value={{ translate: (v) => v, locale: 'en', setLanguage: () => {} }}
        >
            {children}
        </I18NContext.Provider>
    );
};
TestI18N.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useTranslate = () => {
    const context = useContext(I18NContext);

    return context;
};

const getDisplayName = (Component) =>
    Component.displayName || Component.name || 'Component';

/**
 * @deprecated hoc created for retro compatibility purpose.
 * Please use useTranslate hook instead
 */
export const translate = (Component) => {
    const Translated = (props) => {
        const { translate, locale } = useTranslate();

        return (
            <Component {...props} p={{ t: translate, currentLocale: locale }} />
        );
    };

    // needed so that enzyme can detect the wrapped component properly
    Translated.displayName = `Translated(${getDisplayName(Component)})`;

    return Translated;
};
