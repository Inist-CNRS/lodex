import Polyglot, { type InterpolationOptions } from 'node-polyglot';
import React, { createContext, useContext, useMemo } from 'react';
import { connect } from 'react-redux';
import { setLanguage as setLanguageAction } from './index';
import type { State } from '../../admin-app/src/reducers';
import { fromI18n } from '../sharedSelectors';

export const I18NContext = createContext<{
    translate: (
        label: string,
        option?: number | InterpolationOptions | undefined,
    ) => string;
    locale: 'fr' | 'en';
    setLanguage: (lang: 'fr' | 'en') => void;
}>({
    translate: (_label: string, _option?: unknown) => '',
    locale: 'en',
    setLanguage: (_lang: 'fr' | 'en') => {},
});

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
        <I18NContext.Provider value={{ translate, locale, setLanguage }}>
            {children}
        </I18NContext.Provider>
    );
};

const mapStateToProps = (state: State) => ({
    phrases: fromI18n.getPhrases(state),
    locale: fromI18n.getLocale(state),
});

const mapDispatchToProps = {
    setLanguage: setLanguageAction,
};

export const I18N = connect(mapStateToProps, mapDispatchToProps)(I18NComponent);

type TestI18NProps = {
    children: React.ReactNode;
    locale?: 'fr' | 'en';
};

export const TestI18N = ({ children, locale = 'en' }: TestI18NProps) => {
    return (
        <I18NContext.Provider
            value={{
                translate: (v: string, options: any) =>
                    options ? `${v}+${JSON.stringify(options)}` : v,
                locale,
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

const getDisplayName = (Component: { displayName?: string; name?: string }) =>
    Component.displayName || Component.name || 'Component';

/**
 * @deprecated hoc created for retro compatibility purpose.
 * Please use useTranslate hook instead
 */
export const translate = (Component: React.ComponentType<any>) => {
    const Translated = (props: Record<string, unknown>) => {
        const { translate, locale } = useTranslate();

        return (
            <Component {...props} p={{ t: translate, currentLocale: locale }} />
        );
    };

    // needed so that enzyme can detect the wrapped component properly
    Translated.displayName = `Translated(${getDisplayName(Component)})`;

    return Translated;
};
