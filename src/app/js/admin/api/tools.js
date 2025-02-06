export const getUserSessionStorageInfo = () => {
    const localStorageItem = JSON.parse(
        window.localStorage.getItem('redux-localstorage'),
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
