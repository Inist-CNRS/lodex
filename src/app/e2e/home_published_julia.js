import { until, By } from 'selenium-webdriver';
import expect from 'expect';

import driver from '../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../common/tests/fixtures';
import fixtures from './home_published.json';
import { elementIsClicked, inputElementIsFocusable, elementValueIs } from '../../common/tests/conditions';

describe('Home page with published data when logged as Julia', function homePublishedDataTests() {
    this.timeout(10000);
    const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

    before(async () => {
        await clear(); // Had to ensure clear state for unknown reason
        await loadFixtures(fixtures);
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
    });

    it('should display the list with an edit button', async () => {
        await driver.wait(until.elementLocated(By.css('.btn-edit-characteristics')), DEFAULT_WAIT_TIMEOUT);
    });

    it('should display the characteristics edition after clicking the edit button', async () => { // eslint-disable-line
        const button = await driver.findElement(By.css('.btn-edit-characteristics'));
        await driver.wait(elementIsClicked(button), DEFAULT_WAIT_TIMEOUT);

        await driver.wait(until.elementLocated(By.css('.dataset-characteristics-edition')), DEFAULT_WAIT_TIMEOUT);
    });

    it('should display the new characteristics after submitting them', async () => {
        await driver.wait(until.elementLocated(By.css('input[name=movie_value]')), DEFAULT_WAIT_TIMEOUT);
        const input = await driver.findElement(By.css('input[name=movie_value]'));
        await driver.wait(inputElementIsFocusable(input), DEFAULT_WAIT_TIMEOUT);
        input.sendKeys(' updated');

        const button = await driver.findElement(By.css('.btn-update-characteristics'));
        button.click();

        await driver.wait(until.elementLocated(By.css('.dataset-characteristics')), DEFAULT_WAIT_TIMEOUT);
        const movieValue = await driver.findElement(By.css('.dataset-characteristics .property:first-child dd'));
        expect(await movieValue.getText()).toEqual('LOTR updated');
    });

    it('should go to detail page when clicking on uri', async () => {
        const firstUriLink = await driver.findElement(By.linkText('1'));
        const firstUri = await firstUriLink.getText();
        firstUriLink.click();
        await driver.wait(until.elementLocated(By.css('.title')));
        const title = await driver.findElement(By.css('.title, h1'), DEFAULT_WAIT_TIMEOUT);
        driver.wait(until.elementTextIs(title, firstUri), DEFAULT_WAIT_TIMEOUT);
    });

    it('should display all resource properties', async () => {
        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);
        const fullnameLabel = await driver.findElement(By.css('.detail .property:nth-child(2) dt'));
        expect(await fullnameLabel.getText()).toEqual('fullname\nhttp://www.w3.org/ns/person');

        const fullnameValue = await driver.findElement(By.css('.detail .property:nth-child(2) dd'));
        expect(await fullnameValue.getText()).toEqual('PEREGRIN.TOOK');

        const mailLabel = await driver.findElement(By.css('.detail .property:last-child dt'));
        expect(await mailLabel.getText()).toEqual('email\nhttp://uri4uri.net/vocab');

        const mailValue = await driver.findElement(By.css('.detail .property:last-child dd'));
        expect(await mailValue.getText()).toEqual('peregrin.took@shire.net');
    });

    it('should allow to edit resource properties', async () => {
        await driver.findElement(By.css('.edit-resource')).click();
        await driver.wait(until.elementLocated(By.css('.edit-detail')), DEFAULT_WAIT_TIMEOUT);
        const form = driver.findElement(By.css('#resource_form'));
        const fullname = form.findElement(By.css('input[name=fullname]'));
        await driver.wait(elementValueIs(fullname, 'PEREGRIN.TOOK'), DEFAULT_WAIT_TIMEOUT);
        const email = form.findElement(By.css('input[name=email]'));
        await driver.wait(elementValueIs(email, 'peregrin.took@shire.net'), DEFAULT_WAIT_TIMEOUT);

        await email.clear();
        await email.sendKeys('peregrin.took@gondor.net');
        await driver.findElement(By.css('.save-resource')).click();
    });

    it('should save and return to resource page', async () => {
        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);
        const fullnameLabel = await driver.findElement(By.css('.detail .property:nth-child(2) dt'));
        expect(await fullnameLabel.getText()).toEqual('fullname\nhttp://www.w3.org/ns/person');

        const fullnameValue = await driver.findElement(By.css('.detail .property:nth-child(2) dd'));
        expect(await fullnameValue.getText()).toEqual('PEREGRIN.TOOK');

        const mailLabel = await driver.findElement(By.css('.detail .property:last-child dt'));
        expect(await mailLabel.getText()).toEqual('email\nhttp://uri4uri.net/vocab');

        const mailValue = await driver.findElement(By.css('.detail .property:last-child dd'));
        expect(await mailValue.getText()).toEqual('peregrin.took@gondor.net');
    });

    it('should go to hide page', async () => {
        await driver.findElement(By.css('.hide-resource')).click();
        await driver.wait(until.elementLocated(By.css('.hide-detail')), DEFAULT_WAIT_TIMEOUT);
        const form = driver.findElement(By.css('#hide_resource_form'));
        const reason = form.findElement(By.css('textarea[name=reason]'));

        await reason.clear();
        await reason.sendKeys('My bad, should not be here');
        await driver.findElement(By.css('.hide-resource')).click();
    });

    it('should display reason for removal', async () => {
        await driver.wait(until.elementLocated(By.css('.removed-detail')), DEFAULT_WAIT_TIMEOUT);
        const reason = driver.findElement(By.css('.reason'));
        expect(await reason.getText()).toBe('My bad, should not be here');
    });

    after(async () => {
        await clear();
        await driver.executeScript('localStorage.clear();');
    });
});
