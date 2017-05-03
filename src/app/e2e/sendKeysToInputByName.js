import { until, By } from 'selenium-webdriver';

import { inputElementIsFocusable } from '../../common/tests/conditions';

export default async (driver, name, keys, DEFAULT_WAIT_TIMEOUT) => {
    await driver.wait(until.elementLocated(By.css(`input[name="${name}"]`)), DEFAULT_WAIT_TIMEOUT);
    const nameInput = await driver.findElement(By.css(`input[name="${name}"]`));
    await driver.wait(inputElementIsFocusable(nameInput), DEFAULT_WAIT_TIMEOUT);

    return nameInput.sendKeys(keys);
};
