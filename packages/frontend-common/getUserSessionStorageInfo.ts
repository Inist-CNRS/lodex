import { DEFAULT_TENANT } from '@lodex/common';

// one session per instance: the instances of a domain share its localStorage,
// and the logout of one must not end the session of the others
export const getUserStorageKey = () =>
    // @ts-expect-error TS2339
    `redux-localstorage-${window.__TENANT__ || DEFAULT_TENANT}`;

export const getUserSessionStorageInfo = () => {
    const localStorageItem = JSON.parse(
        // @ts-expect-error TS2345
        window.localStorage.getItem(getUserStorageKey()),
    );
    if (typeof localStorageItem === 'string') {
        try {
            const localStorage = JSON.parse(localStorageItem);
            return localStorage.user;
        } catch (e) {
            console.error('Error parsing sessionStorageItem', e);
            return null;
        }
    }
    return localStorageItem.user;
};
