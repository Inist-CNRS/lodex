import { until, By } from 'selenium-webdriver';
import expect from 'expect';

import driver from '../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../common/tests/fixtures';
import fixtures from './home_published.json';
import { inputElementIsFocusable } from '../../common/tests/conditions';


describe('Home page with published data', function homePublishedDataTests() {
    this.timeout(10000);
    const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

    before(async () => {
        await clear(); // Had to ensure clear state for unknown reason
        await loadFixtures(fixtures);
        await driver.get('http://localhost:3010/');
    });

    it('should display the dataset characteristics', async () => {
        await driver.wait(until.elementLocated(By.css('.dataset-characteristics')), DEFAULT_WAIT_TIMEOUT);
        const datasetCharacteristics = await driver.findElements(By.css('.dataset-characteristics'));
        expect(datasetCharacteristics.length).toEqual(1);
        const properties = await driver.findElements(By.css('.dataset-characteristics .property'));
        expect(properties.length).toEqual(2);

        const movieLabel = await driver.findElement(
            By.css('.dataset-characteristics .property:first-child .property_name'),
        );
        expect(await movieLabel.getText()).toEqual('movie');

        const movieValue = await driver.findElement(By.css('.dataset-characteristics .property:first-child dd'));
        expect(await movieValue.getText()).toEqual('LOTR');

        const authorLabel = await driver.findElement(
            By.css('.dataset-characteristics .property:last-child .property_name'),
        );
        expect(await authorLabel.getText()).toEqual('author');

        const authorValue = await driver.findElement(By.css('.dataset-characteristics .property:last-child dd'));
        expect(await authorValue.getText()).toEqual('Peter Jackson');
    });

    it('should display the list', async () => {
        await driver.wait(until.elementLocated(By.css('.dataset')), DEFAULT_WAIT_TIMEOUT);
        const headers = await driver.findElements(By.css('.dataset table th'));
        const headersText = await Promise.all(headers.map(h => h.getText()));
        expect(headersText).toEqual(['uri', 'fullname', 'email']);

        const tds = await driver.findElements(By.css('.dataset table tbody td'));
        const tdsText = await Promise.all(tds.map(td => td.getText()));
        expect(tdsText.some(t => t === 'PEREGRIN.TOOK')).toEqual(true);
        expect(tdsText.some(t => t === 'peregrin.took@shire.net')).toEqual(true);
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

    it('should allow to add field resource properties', async () => {
        await driver.findElement(By.css('.add-field-resource')).click();
        await driver.wait(until.elementLocated(By.css('.detail-properties')), DEFAULT_WAIT_TIMEOUT);
        const form = driver.findElement(By.css('#add_field_resource_form'));

        const contributorName = form.findElement(By.css('.contributor-name input'));
        contributorName.sendKeys('john');
        const contributorMail = form.findElement(By.css('.contributor-mail input'));
        contributorMail.sendKeys('john@doe.fr');

        const selectField = form.findElement(By.css('.select-field'));
        selectField.click();
        await driver.findElement(By.css('.new')).click();

        const fieldName = form.findElement(By.css('.field-name input'));
        await driver.wait(inputElementIsFocusable(fieldName, true), DEFAULT_WAIT_TIMEOUT);
        fieldName.sendKeys('myContribution');
        const fieldLabel = form.findElement(By.css('.field-label input'));
        await driver.wait(inputElementIsFocusable(fieldLabel, true), DEFAULT_WAIT_TIMEOUT);
        fieldLabel.sendKeys('my contribution');
        const fieldScheme = form.findElement(By.css('.field-scheme input'));
        await driver.wait(inputElementIsFocusable(fieldScheme, true), DEFAULT_WAIT_TIMEOUT);
        fieldScheme.sendKeys('http://vocab/field');
        const fieldValue = form.findElement(By.css('.field-value input'));
        await driver.wait(inputElementIsFocusable(fieldValue, true), DEFAULT_WAIT_TIMEOUT);
        fieldValue.sendKeys('my value');

        await driver.findElement(By.css('.add-field-to-resource')).click();
    });

    it('should display added field in new detail', async () => {
        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);
        const contributionLabel = await driver.findElement(By.css('.detail .property:last-child dt'));
        expect(await contributionLabel.getText()).toEqual('myContribution\nContributed by john');

        const contributionValue = await driver.findElement(By.css('.detail .property:last-child dd'));
        expect(await contributionValue.getText()).toEqual('my value');
    });

    after(async () => {
        await clear();
        await driver.executeScript('localStorage.clear();');
    });
});
