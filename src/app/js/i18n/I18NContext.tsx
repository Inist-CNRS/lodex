// @ts-expect-error TS7016
import Polyglot from 'node-polyglot';
import PropTypes from 'prop-types';
import React, { createContext, useContext, useMemo } from 'react';
import { connect } from 'react-redux';
import { fromI18n } from '../public/selectors';
import { setLanguage as setLanguageAction } from './index';

// @ts-expect-error TS7006
const I18NContext = createContext({ translate: (_label) => '' });

// @ts-expect-error TS7031
export const I18NComponent = ({ locale, phrases, setLanguage, children }) => {
    const translate = useMemo(() => {
        const polyglot = new Polyglot({
            locale,
            phrases,
        });
        return polyglot.t.bind(polyglot);
    }, [locale, phrases]);

    return (
        // @ts-expect-error TS2353
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

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    phrases: fromI18n.getPhrases(state),
    // @ts-expect-error TS2339
    locale: fromI18n.getLocale(state),
});

const mapDispatchToProps = {
    setLanguage: setLanguageAction,
};

export const I18N = connect(mapStateToProps, mapDispatchToProps)(I18NComponent);
// @ts-expect-error TS7031
export const TestI18N = ({ children }) => {
    return (
        <I18NContext.Provider
            value={{
                // @ts-expect-error TS2322
                translate: (v, options) =>
                    options ? `${v}+${JSON.stringify(options)}` : v,
                locale: 'en',
                setLanguage: () => {},
            }}
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

// @ts-expect-error TS7006
const getDisplayName = (Component) =>
    Component.displayName || Component.name || 'Component';

/**
 * @deprecated hoc created for retro compatibility purpose.
 * Please use useTranslate hook instead
 */
// @ts-expect-error TS7006
export const translate = (Component) => {
    // @ts-expect-error TS7006
    const Translated = (props) => {
        // @ts-expect-error TS2339
        const { translate, locale } = useTranslate();

        return (
            <Component {...props} p={{ t: translate, currentLocale: locale }} />
        );
    };

    // needed so that enzyme can detect the wrapped component properly
    Translated.displayName = `Translated(${getDisplayName(Component)})`;

    return Translated;
};
