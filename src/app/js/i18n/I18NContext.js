import React, { createContext, useContext } from 'react';
import Polyglot from 'node-polyglot';
import { fromI18n } from '../public/selectors';
import { connect } from 'react-redux';
import { setLanguage as setLanguageAction } from './index';
import PropTypes from 'prop-types';

const I18NContext = createContext({ translate: () => '' });

const I18NComponent = ({ locale, phrases, setLanguage, children }) => {
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

export const useTranslate = () => {
    const context = useContext(I18NContext);

    return context;
};

/**
 * @deprecated hoc created for retro compatibility purpose.
 * Please use useTranslate hook instead
 */
export const translate = (Component) => {
    const ComponentWithTranslate = (props) => {
        const { translate, locale } = useTranslate();

        return (
            <Component {...props} p={{ t: translate, currentLocale: locale }} />
        );
    };

    return ComponentWithTranslate;
};
