import { until, By } from 'selenium-webdriver';

import driver from '../../../common/tests/chromeDriver';
import { clear } from '../../../common/tests/fixtures';
import { inputElementIsFocusable } from '../../../common/tests/conditions';

describe('Admin', function adminTests() {
    this.timeout(10000);
    const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

    before(async () => {
        await clear();
    });

    it('should redirect to the login page if not authenticated', async () => {
        await driver.get('http://localhost:3010/admin');
        await driver.wait(until.elementLocated(By.css('#login_form')), DEFAULT_WAIT_TIMEOUT);
    });

    it('should redirect to the admin after successfull login', async () => {
        const username = await driver.findElement(By.css('input[name=username]'));
        const password = await driver.findElement(By.css('input[name=password]'));
        const form = await driver.findElement(By.css('#login_form'));

        await driver.wait(inputElementIsFocusable(username, true), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(inputElementIsFocusable(password, true), DEFAULT_WAIT_TIMEOUT);

        await username.clear();
        await username.sendKeys('user');
        await password.clear();
        await password.sendKeys('secret');
        await form.submit();
        await driver.wait(until.elementLocated(By.css('.admin')), DEFAULT_WAIT_TIMEOUT);
    });

    after(async () => {
        await clear();
        await driver.executeScript('localStorage.clear();');
    });
});
