export const getUserLocalStorageInfo = () => {
    const localStorageItem = JSON.parse(
        window.localStorage.getItem('redux-localstorage'),
    );
    return typeof localStorageItem === 'string'
        ? JSON.parse(localStorageItem).user
        : localStorageItem.user;
};
