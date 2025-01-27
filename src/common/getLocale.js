import get from 'lodash/get';

export default (ctx) => {
    if (process.env.NODE_ENV === 'e2e') {
        return 'en';
    }
    if (ctx && ctx.acceptsLanguages) {
        return ctx.acceptsLanguages('en', 'fr');
    }
    try {
        return get(window, 'navigator.language', 'en').split('-')[0];
    } catch (_error) {
        return 'en';
    }
};
