import { until, By } from 'selenium-webdriver';

import driver from '../../common/tests/chromeDriver';
import { inputElementIsFocusable } from '../../common/tests/conditions';

const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

export default async (baseAppPath, nextpathname) => {
    await driver.get(`http://localhost:3010${baseAppPath}?nextpathname=${encodeURIComponent(nextpathname)}#/login`);

    const form = await driver.findElement(By.css('form'));
    const username = await driver.findElement(By.css('input[name=username]'));
    const password = await driver.findElement(By.css('input[name=password]'));
    await driver.wait(inputElementIsFocusable(username, true), DEFAULT_WAIT_TIMEOUT);
    await driver.wait(inputElementIsFocusable(password, true), DEFAULT_WAIT_TIMEOUT);

    await username.sendKeys('user');
    await password.sendKeys('secret');
    await form.submit();
    await driver.wait(until.urlMatches(new RegExp(nextpathname)));
};
