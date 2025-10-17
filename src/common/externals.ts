export const ISTEX_API_URL = (function () {
    if (typeof window === 'undefined') {
        return require('config').istexApiUrl;
    }
    // @ts-expect-error TS(2304): Cannot find name 'window'.
    return window.ISTEX_API_URL || 'https://api.istex.fr';
})();

export const ISTEX_SITE_URL = 'https://search.istex.fr';
