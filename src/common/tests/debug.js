import logging from 'selenium-webdriver/lib/logging';

export const getState = async driver =>
    driver.executeScript(() => window.store.getState());

export const printBrowserLog = async driver =>
    driver
        .manage()
        .logs()
        .get(logging.Type.BROWSER)
        .then((entries) => {
            entries
                .forEach((entry) => {
                    console.log('[%s] %s', entry.level.name, entry.message);
                });
        });
