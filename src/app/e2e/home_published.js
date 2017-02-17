import { until, By } from 'selenium-webdriver';
import expect from 'expect';

import driver from '../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../common/tests/fixtures';
import fixtures from './home_published.json';
import { inputElementIsFocusable, elementIsClicked } from '../../common/tests/conditions';

describe('Home page with published data', function homePublishedDataTests() {
    this.timeout(100000);
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
        expect(headersText).toEqual(['uri', 'fullname', 'email', 'best_friend_of']);

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
        await driver.wait(until.elementTextIs(fullnameLabel, 'fullname\nhttp://www.w3.org/ns/person'), DEFAULT_WAIT_TIMEOUT);

        const fullnameValue = await driver.findElement(By.css('.detail .property:nth-child(2) dd'));
        await driver.wait(until.elementTextIs(fullnameValue, 'PEREGRIN.TOOK'), DEFAULT_WAIT_TIMEOUT);

        const mailLabel = await driver.findElement(By.css('.detail .property:nth-child(3) dt'));
        await driver.wait(until.elementTextIs(mailLabel, 'email\nhttp://uri4uri.net/vocab'), DEFAULT_WAIT_TIMEOUT);

        const mailValue = await driver.findElement(By.css('.detail .property:nth-child(3) dd'));
        await driver.wait(until.elementTextIs(mailValue, 'peregrin.took@shire.net'), DEFAULT_WAIT_TIMEOUT);

        const bestFriendLabel = await driver.findElement(By.css('.detail .property:last-child dt'));
        await driver.wait(until.elementTextIs(bestFriendLabel, 'best_friend_of\nhttp://www.w3.org/ns/person'), DEFAULT_WAIT_TIMEOUT);

        const bestFriendValue = await driver.findElement(By.css('.detail .property:last-child dd'));
        await driver.wait(until.elementTextIs(bestFriendValue, 'MERIADOC.BRANDYBUCK'), DEFAULT_WAIT_TIMEOUT);
    });

    it('should allow to add field resource properties', async () => {
        const addFieldResource = await driver.findElement(By.css('.add-field-resource'));
        await driver.wait(elementIsClicked(addFieldResource), DEFAULT_WAIT_TIMEOUT);

        await driver.wait(until.elementLocated(By.css('.detail-properties')), DEFAULT_WAIT_TIMEOUT);
        const form = driver.findElement(By.css('#add_field_resource_form'));

        const contributorName = form.findElement(By.css('.contributor-name input'));
        await driver.wait(inputElementIsFocusable(contributorName, true), DEFAULT_WAIT_TIMEOUT);
        contributorName.sendKeys('john');
        const contributorMail = form.findElement(By.css('.contributor-mail input'));
        await driver.wait(inputElementIsFocusable(contributorMail, true), DEFAULT_WAIT_TIMEOUT);
        contributorMail.sendKeys('john@doe.fr');

        const selectField = form.findElement(By.css('.select-field'));
        await driver.wait(elementIsClicked(selectField), DEFAULT_WAIT_TIMEOUT);
        const newField = await driver.findElement(By.css('.new'));
        await driver.wait(elementIsClicked(newField), DEFAULT_WAIT_TIMEOUT);

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

        const addFieldButton = await driver.findElement(By.css('.add-field-to-resource'));
        await driver.wait(elementIsClicked(addFieldButton), DEFAULT_WAIT_TIMEOUT);
    });

    it('should display added field in new detail', async () => {
        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);
        const contributionLabel = await driver.findElement(By.css('.detail .property:last-child dt'));
        await driver.wait(
            until.elementTextIs(contributionLabel, 'myContribution\nContributed by john'), DEFAULT_WAIT_TIMEOUT,
        );

        const contributionValue = await driver.findElement(By.css('.detail .property:last-child dd'));
        await driver.wait(until.elementTextIs(contributionValue, 'my value'), DEFAULT_WAIT_TIMEOUT);
    });

    after(async () => {
        await clear();
        await driver.executeScript('localStorage.clear();');
    });
});
