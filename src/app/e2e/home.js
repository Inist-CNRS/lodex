import { until, By } from 'selenium-webdriver';
import expect from 'expect';
import driver from '../../common/tests/chromeDriver';

describe('Home page', function homeTests() {
    this.timeout(15000);

    it('should display the Appbar with correct title', async () => {
        await driver.get('http://localhost:3010/');
        const title = await driver.findElement(By.css('.appbar a'));
        const text = await title.getText();
        expect(text).toEqual('Lodex');
    });

    it('should display the Appbar with a sign-in button', async () => {
        const button = await driver.findElement(By.css('.appbar button'));
        const text = await button.getText();
        expect(text).toEqual('SIGN IN');
    });

    it('click on sign-in button should display the sign-in modal', async () => {
        const button = await driver.findElement(By.css('.appbar button'));
        await button.click();
        await driver.wait(until.elementLocated(By.css('.dialog-login h3')));
    });

    it('submitting the form with invalid credentials should show an error', async () => {
        const username = await driver.findElement(By.css('input[name=username]'));
        const password = await driver.findElement(By.css('input[name=password]'));
        const form = await driver.findElement(By.css('.dialog-login form'));
        await username.sendKeys('foo');
        await password.sendKeys('foo');
        await form.submit();
        await driver.wait(until.elementLocated(By.css('.alert')));
        const alert = await driver.findElement(By.css('.alert'));
        const text = await alert.getText();
        expect(text).toEqual('Unauthorized');
    });

    it('submitting the form with valid credentials should close it', async () => {
        const username = await driver.findElement(By.css('input[name=username]'));
        const password = await driver.findElement(By.css('input[name=password]'));
        const form = await driver.findElement(By.css('.dialog-login form'));
        await username.clear();
        await username.sendKeys('user');
        await password.clear();
        await password.sendKeys('secret');
        await form.submit();
        await driver.sleep(500);
        const elements = await driver.findElements(By.css('.dialog-login h3'));
        expect(elements.length).toEqual(0);
    });

    after(() => {
        driver.quit();
    });
});
