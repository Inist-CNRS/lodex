export const getUserSessionStorageInfo = () => {
    const sessionStorageItem = JSON.parse(
        window.sessionStorage.getItem('redux-localstorage'),
    );
    if (typeof sessionStorageItem === 'string') {
        try {
            const sessionStorage = JSON.parse(sessionStorageItem);
            return sessionStorage.user;
        } catch (e) {
            console.error('Error parsing sessionStorageItem', e);
            return null;
        }
    }
    return sessionStorageItem.user;
};
