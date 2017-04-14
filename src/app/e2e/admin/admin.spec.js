import { until, By } from 'selenium-webdriver';

import driver from '../../../common/tests/chromeDriver';
import { clear } from '../../../common/tests/fixtures';
import { inputElementIsFocusable } from '../../../common/tests/conditions';
import navigate from '../navigate';

describe('Admin', function adminTests() {
    this.timeout(30000);
    const DEFAULT_WAIT_TIMEOUT = 19000; // A bit less than mocha's timeout to get explicit errors from selenium

    before(async () => {
        await driver.executeScript('localStorage.clear();');
        await driver.executeScript('sessionStorage.clear();');
        await clear();
    });

    it('should redirect to the login page if not authenticated', async () => {
        await navigate('/admin');
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
        await driver.executeScript('sessionStorage.clear();');
    });
});
