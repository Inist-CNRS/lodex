export const ISTEX_API_URL = (function() {
    if (typeof window === 'undefined') {
        return require('config').istexApiUrl;
    }
    return window.ISTEX_API_URL;
})();

export const ISTEX_SITE_URL = 'https://dl.istex.fr';
