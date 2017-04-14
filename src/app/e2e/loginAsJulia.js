import { until, By } from 'selenium-webdriver';

import driver from '../../common/tests/chromeDriver';
import { inputElementIsFocusable } from '../../common/tests/conditions';
import navigate from './navigate';

const DEFAULT_WAIT_TIMEOUT = 19000; // A bit less than mocha's timeout to get explicit errors from selenium

export default async (nextpathname) => {
    await navigate(`/login?nextPathname=${encodeURIComponent(nextpathname)}`);

    await driver.wait(until.elementLocated(By.css('form')));
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
