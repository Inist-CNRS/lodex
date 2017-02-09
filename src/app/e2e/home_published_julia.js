import { until, By } from 'selenium-webdriver';
import expect from 'expect';

import driver from '../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../common/tests/fixtures';
import fixtures from './home_published.json';
import { elementIsClickable } from '../../common/tests/conditions';

describe('Home page with published data when logged as Julia', function homePublishedDataTests() {
    this.timeout(10000);
    const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

    before(async () => {
        await clear(); // Had to ensure clear state for unknown reason
        await loadFixtures(fixtures);
        await driver.get('http://localhost:3010/');

        const button = await driver.findElement(By.css('.appbar button'));
        await driver.wait(elementIsClickable(button), DEFAULT_WAIT_TIMEOUT);
        await button.click();

        const buttonSignIn = await driver.findElement(By.css('.btn-sign-in'));
        await driver.wait(elementIsClickable(buttonSignIn), DEFAULT_WAIT_TIMEOUT);
        await buttonSignIn.click();

        const form = await driver.findElement(By.css('.dialog-login form'));
        const username = await driver.findElement(By.css('input[name=username]'));
        const password = await driver.findElement(By.css('input[name=password]'));
        await driver.sleep(500);

        await username.sendKeys('user');
        await password.sendKeys('secret');
        await form.submit();
        await driver.wait(until.stalenessOf(form), DEFAULT_WAIT_TIMEOUT);
    });

    it('should display the list with an edit button', async () => {
        await driver.wait(until.elementLocated(By.css('.btn-edit-characteristics')), DEFAULT_WAIT_TIMEOUT);
    });

    it('should display the characteristics edition after clicking the edit button', async () => { // eslint-disable-line
        const button = await driver.findElement(By.css('.btn-edit-characteristics'));
        await driver.wait(elementIsClickable(button), DEFAULT_WAIT_TIMEOUT);
        button.click();

        await driver.wait(until.elementLocated(By.css('.dataset-characteristics-edition')), DEFAULT_WAIT_TIMEOUT);
    });

    it('should display the new characteristics after submitting them', async () => {
        await driver.wait(until.elementLocated(By.css('input[name=movie_value]')), DEFAULT_WAIT_TIMEOUT);
        const input = await driver.findElement(By.css('input[name=movie_value]'));
        await driver.wait(elementIsClickable(input), DEFAULT_WAIT_TIMEOUT);
        input.sendKeys(' updated');

        const button = await driver.findElement(By.css('.btn-update-characteristics'));
        button.click();

        await driver.wait(until.elementLocated(By.css('.dataset-characteristics')), DEFAULT_WAIT_TIMEOUT);
        const movieValue = await driver.findElement(By.css('.dataset-characteristics .property:first-child dd'));
        expect(await movieValue.getText()).toEqual('LOTR updated');
    });

    after(async () => {
        await clear();
        await driver.executeScript('localStorage.clear();');
    });
});
