import Polyglot from 'node-polyglot';
import React, { createContext, useContext, useMemo } from 'react';
import { connect } from 'react-redux';
import { fromI18n } from '../public/selectors';
import { setLanguage as setLanguageAction } from './index';

// @ts-expect-error TS7006
const I18NContext = createContext({ translate: (_label) => '' });

type I18NComponentProps = {
    locale: 'fr' | 'en';
    phrases: Record<string, string>;
    setLanguage: (lang: 'fr' | 'en') => void;
    children: React.ReactNode;
};
export const I18NComponent = ({
    locale,
    phrases,
    setLanguage,
    children,
}: I18NComponentProps) => {
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

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    phrases: fromI18n.getPhrases(state),
    locale: fromI18n.getLocale(state),
});

const mapDispatchToProps = {
    setLanguage: setLanguageAction,
};

export const I18N = connect(mapStateToProps, mapDispatchToProps)(I18NComponent);

type TestI18NProps = {
    children: React.ReactNode;
};

export const TestI18N = ({ children }: TestI18NProps) => {
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
