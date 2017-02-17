import { until, By } from 'selenium-webdriver';

import driver from '../../common/tests/chromeDriver';
import { elementIsClicked, inputElementIsFocusable } from '../../common/tests/conditions';

const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

export default async () => {
    await driver.get('http://localhost:3010/');

    const button = await driver.findElement(By.css('.appbar button'));
    await driver.wait(elementIsClicked(button), DEFAULT_WAIT_TIMEOUT);

    const buttonSignIn = await driver.findElement(By.css('.btn-sign-in'));
    await driver.wait(elementIsClicked(buttonSignIn), DEFAULT_WAIT_TIMEOUT);

    const form = await driver.findElement(By.css('.dialog-login form'));
    const username = await driver.findElement(By.css('input[name=username]'));
    const password = await driver.findElement(By.css('input[name=password]'));
    await driver.wait(inputElementIsFocusable(username, true), DEFAULT_WAIT_TIMEOUT);
    await driver.wait(inputElementIsFocusable(password, true), DEFAULT_WAIT_TIMEOUT);

    await username.sendKeys('user');
    await password.sendKeys('secret');
    await form.submit();
    await driver.wait(until.stalenessOf(form), DEFAULT_WAIT_TIMEOUT);
};
