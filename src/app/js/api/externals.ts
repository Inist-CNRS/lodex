const defaultIstexApiUrl = 'https://api.istex.fr';

export const ISTEX_API_URL = (() => {
    if (typeof window === 'undefined') {
        return defaultIstexApiUrl;
    }
    return window?.ISTEX_API_URL || defaultIstexApiUrl;
})();

declare global {
    interface Window {
        ISTEX_API_URL?: string;
    }
}
