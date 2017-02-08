import { until, By } from 'selenium-webdriver';
import expect from 'expect';
import driver from '../../common/tests/chromeDriver';

import { elementIsClickable } from '../../common/tests/conditions';

describe('Home page', function homeTests() {
    this.timeout(15000);
    let button;
    let username;
    let password;
    let form;

    it('should display the Appbar with correct title', async () => {
        await driver.get('http://localhost:3010/');
        const title = await driver.findElement(By.css('.appbar a'));
        const text = await title.getText();
        expect(text).toEqual('Lodex');
    });

    it('should display the Appbar with a menu button', async () => {
        button = await driver.findElement(By.css('.appbar button'));
    });

    it('click on sign-in button should display the sign-in modal', async () => {
        await button.click();

        const buttonSignIn = await driver.findElement(By.css('.btn-sign-in'));
        await driver.wait(until.elementIsVisible(buttonSignIn));
        await buttonSignIn.click();

        form = await driver.findElement(By.css('.dialog-login form'));
        username = await driver.findElement(By.css('input[name=username]'));
        password = await driver.findElement(By.css('input[name=password]'));

        await driver.wait(elementIsClickable(username));
        await driver.sleep(500); // Needed because of dialog animation
    });

    it('submitting the form with invalid credentials should show an error', async () => {
        await username.sendKeys('foo');
        await password.sendKeys('foo');
        await form.submit();
        await driver.wait(until.elementLocated(By.css('.alert')));
        const alert = await driver.findElement(By.css('.alert'));
        const text = await alert.getText();
        expect(text).toEqual('Unauthorized');
    });

    it('submitting the form with valid credentials should close it', async () => {
        await username.clear();
        await username.sendKeys('user');
        await password.clear();
        await password.sendKeys('secret');
        await form.submit();
        await driver.sleep(500);
        const elements = await driver.findElements(By.css('.dialog-login h3'));
        expect(elements.length).toEqual(0);
    });

    after(async () => {
        await driver.executeScript('localStorage.clear();');
    });
});
