export const getUserLocalStorageInfo = () => {
    const localStorageItem = JSON.parse(
        window.localStorage.getItem('redux-localstorage'),
    );
    if (typeof localStorageItem === 'string') {
        try {
            const localStorage = JSON.parse(localStorageItem);
            return localStorage.user;
        } catch (e) {
            console.error('Error parsing localStorageItem', e);
            return null;
        }
    }
    return localStorageItem.user;
};
