import { until, By } from 'selenium-webdriver';
import driver from '../../common/tests/chromeDriver';

import { elementIsClicked, inputElementIsFocusable } from '../../common/tests/conditions';

describe('Home page', function homeTests() {
    this.timeout(30000);
    const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

    let username;
    let password;
    let form;

    it('should display the Appbar with correct title', async () => {
        await driver.get('http://localhost:3010/');
        await driver.wait(until.elementLocated(By.css('.appbar')), DEFAULT_WAIT_TIMEOUT);
        const title = await driver.findElement(By.css('.appbar a'));
        driver.wait(until.elementTextIs(title, 'Lodex'), DEFAULT_WAIT_TIMEOUT);
    });

    it('click on sign-in button should display the sign-in modal', async () => {
        const buttonSignIn = await driver.findElement(By.css('.btn-sign-in'));
        await driver.wait(elementIsClicked(buttonSignIn), DEFAULT_WAIT_TIMEOUT);

        form = await driver.findElement(By.css('.dialog-login form'));
        username = await driver.findElement(By.css('input[name=username]'));
        password = await driver.findElement(By.css('input[name=password]'));

        await driver.wait(inputElementIsFocusable(username, true), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(inputElementIsFocusable(password, true), DEFAULT_WAIT_TIMEOUT);
    });

    it('submitting the form with invalid credentials should show an error', async () => {
        await username.sendKeys('foo');
        await password.sendKeys('foo');
        await form.submit();
        await driver.wait(until.elementLocated(By.css('.alert')), DEFAULT_WAIT_TIMEOUT);
        const alert = await driver.findElement(By.css('.alert'));
        driver.wait(until.elementTextIs(alert, 'Unauthorized'), DEFAULT_WAIT_TIMEOUT);
    });

    it('submitting the form with valid credentials should close it', async () => {
        await username.clear();
        await username.sendKeys('user');
        await password.clear();
        await password.sendKeys('secret');
        await form.submit();
        await driver.wait(until.stalenessOf(form), DEFAULT_WAIT_TIMEOUT);
    });

    after(async () => {
        await driver.executeScript('localStorage.clear();');
    });
});
