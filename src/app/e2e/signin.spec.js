import { until, By } from 'selenium-webdriver';
import { elementTextIs } from 'selenium-smart-wait';

import driver from '../../common/tests/chromeDriver';
import { inputElementIsFocusable } from '../../common/tests/conditions';

describe('Home page', function homeTests() {
    this.timeout(30000);
    const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

    let username;
    let password;
    let form;

    before(async () => {
        await driver.get('http://localhost:3100/login');
    });

    it('show the sign-in form', async () => {
        await driver.wait(until.elementLocated(By.css('#login_form')), DEFAULT_WAIT_TIMEOUT);

        form = await driver.findElement(By.css('#login_form'));
        username = await driver.findElement(By.css('input[name=username]'));
        password = await driver.findElement(By.css('input[name=password]'));

        await driver.wait(inputElementIsFocusable(username, true), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(inputElementIsFocusable(password, true), DEFAULT_WAIT_TIMEOUT);
    });

    it('submitting the form with invalid credentials should show an error', async () => {
        form = await driver.findElement(By.css('#login_form'));
        username = await driver.findElement(By.css('input[name=username]'));
        password = await driver.findElement(By.css('input[name=password]'));

        await driver.wait(inputElementIsFocusable(username, true), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(inputElementIsFocusable(password, true), DEFAULT_WAIT_TIMEOUT);

        await username.sendKeys('foo');
        await password.sendKeys('foo');
        await form.submit();
        await driver.wait(until.elementLocated(By.css('.alert')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(elementTextIs('.alert', 'Unauthorized', DEFAULT_WAIT_TIMEOUT));
    });

    it('submitting the form with valid credentials should close it', async () => {
        form = await driver.findElement(By.css('#login_form'));
        username = await driver.findElement(By.css('input[name=username]'));
        password = await driver.findElement(By.css('input[name=password]'));

        await driver.wait(inputElementIsFocusable(username, true), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(inputElementIsFocusable(password, true), DEFAULT_WAIT_TIMEOUT);

        await username.clear();
        await username.sendKeys('user');
        await password.clear();
        await password.sendKeys('secret');
        await form.submit();
        await driver.wait(until.urlIs('http://localhost:3100/home'), DEFAULT_WAIT_TIMEOUT);
    });

    after(async () => {
        await driver.executeScript('localStorage.clear();');
        await driver.executeScript('sessionStorage.clear();');
    });
});
