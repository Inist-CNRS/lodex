import { until, By } from 'selenium-webdriver';
import expect from 'expect';
import {
    elementTextIs,
    elementIsClicked,
    elementValueIs,
} from 'selenium-smart-wait';

import driver from '../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../common/tests/fixtures';
import fixtures from './home_published.json';
import loginAsJulia from './loginAsJulia';
import navigate from './navigate';

describe('Ontology', function homePublishedDataTests() {
    this.timeout(30000);
    const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

    before(async () => {
        await clear();
        await loadFixtures(fixtures);
        await navigate('/');
    });

    it('should display all header in list', async () => {
        const headers = await driver.findElements(By.css('.dataset table th button'));
        const expectedHeaders = ['URI', 'FIRSTNAME', 'NAME', 'EMAIL', 'BEST FRIEND OF'];
        await Promise.all(headers.map(async (header, index) =>
            driver.wait(elementTextIs(header, expectedHeaders[index], DEFAULT_WAIT_TIMEOUT)),
        ));
    });

    it('should have an ontology tab on home page', async () => {
        await driver.wait(until.elementLocated(By.css('.tab-dataset-ontology')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(elementIsClicked('.tab-dataset-ontology'));
        await driver.wait(until.elementLocated(By.css('.ontology')), DEFAULT_WAIT_TIMEOUT);

        expect(await driver.findElement(By.css('.ontology .field-label.uri')).getText()).toEqual('URI');
        expect(await driver.findElement(By.css('.ontology .field-scheme.uri')).getText()).toEqual('http://uri4uri.net/vocab#URI');
        expect(await driver.findElement(
            By.css('.ontology .field-cover.uri'),
        ).getText()).toEqual('Different for each resource');

        expect(await driver.findElement(By.css('.ontology .field-label.name')).getText()).toEqual('name');
        expect(await driver.findElement(
            By.css('.ontology .field-cover.name'),
        ).getText()).toEqual('Different for each resource');

        expect(await driver.findElement(By.css('.ontology .field-label.full_name')).getText()).toEqual('Full name');
        expect(await driver.findElement(By.css('.ontology .field-scheme.full_name')).getText()).toEqual('http://www.w3.org/ns/person');
        expect(await driver.findElement(
            By.css('.ontology .field-cover.full_name'),
        ).getText()).toEqual('Different for each resource');

        expect(await driver.findElement(By.css('.ontology .field-label.firstname')).getText()).toEqual('firstname');
        expect(await driver.findElement(
            By.css('.ontology .field-cover.firstname'),
        ).getText()).toEqual('Different for each resource');

        expect(await driver.findElement(By.css('.ontology .field-label.email')).getText()).toEqual('Email');
        expect(await driver.findElement(By.css('.ontology .field-scheme.email')).getText()).toEqual('http://uri4uri.net/vocab');
        expect(await driver.findElement(
            By.css('.ontology .field-cover.email'),
        ).getText()).toEqual('Different for each resource');

        expect(await driver.findElement(
            By.css('.ontology .field-label.best_friend_of'),
        ).getText()).toEqual('Best Friend Of');
        expect(await driver.findElement(By.css('.ontology .field-scheme.best_friend_of')).getText()).toEqual('http://www.w3.org/ns/person');
        expect(await driver.findElement(
            By.css('.ontology .field-cover.best_friend_of'),
        ).getText()).toEqual('Different for each resource');
        expect(await driver.findElement(
            By.css('.ontology .field-language.best_friend_of'),
        ).getText()).toEqual('Français');

        expect(await driver.findElement(By.css('.ontology .field-label.movie')).getText()).toEqual('Movie');
        expect(await driver.findElement(
            By.css('.ontology .field-cover.movie'),
        ).getText()).toEqual('Apply to whole dataset');

        expect(await driver.findElement(By.css('.ontology .field-label.author')).getText()).toEqual('Author');
        expect(await driver.findElement(
            By.css('.ontology .field-cover.author'),
        ).getText()).toEqual('Apply to whole dataset');
    });

    it('should not display edit button', async () => {
        const editButtons = await driver.findElements(By.css('.configure-field'));
        expect(editButtons.length).toBe(0);
    });

    it('should login', async () => {
        await loginAsJulia('/', '/');
        await driver.wait(until.elementLocated(By.css('.tab-dataset-ontology')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(elementIsClicked('.tab-dataset-ontology'));
        await driver.wait(until.elementLocated(By.css('.ontology')), DEFAULT_WAIT_TIMEOUT);
    });

    it('should display edit button once logged', async () => {
        const editButtons = await driver.findElements(By.css('.configure-field'));
        expect(editButtons.length).toBe(8);
    });

    it('should edit form for full_name field changing its position', async () => {
        await driver.wait(elementIsClicked('.configure-field.full_name', DEFAULT_WAIT_TIMEOUT));
        await driver.wait(until.elementLocated(By.css('#field_form')));
        const form = await driver.findElement(By.css('#field_form'));

        await driver.wait(elementIsClicked('.select-position'));
        await driver.sleep(1000);
        await driver.wait(elementIsClicked('.after_uri'));
        await driver.sleep(1000);

        await driver.wait(elementIsClicked('.configure-field.save', DEFAULT_WAIT_TIMEOUT));
        await driver.wait(until.stalenessOf(form));
    });

    it('should have updated positions', async () => {
        const fields = await driver.findElements(By.css('.field-label'));
        const expectedFields = ['URI', 'Full name', 'Movie', 'firstname', 'name', 'Email', 'Best Friend Of', 'Author'];
        await Promise.all(fields.map(async (header, index) =>
            driver.wait(elementTextIs(header, expectedFields[index], DEFAULT_WAIT_TIMEOUT)),
        ));
    });

    it('should edit form for email field removing it from list', async () => {
        await driver.wait(elementIsClicked('.configure-field.email', DEFAULT_WAIT_TIMEOUT));
        await driver.wait(until.elementLocated(By.css('#field_form')));
        const fields = await driver.findElements(By.css('#field_form > div'));
        const listDisplayLabel = await fields[0].findElement(By.css('label'));
        await driver.wait(elementTextIs(listDisplayLabel, 'Display on list page', DEFAULT_WAIT_TIMEOUT));
        const listDisplayInput = await fields[0].findElement(By.css('input'));
        await driver.wait(elementValueIs(listDisplayInput, 'on', DEFAULT_WAIT_TIMEOUT));

        const resourceDisplayLabel = await fields[1].findElement(By.css('label'));
        await driver.wait(elementTextIs(resourceDisplayLabel, 'Display on resource page', DEFAULT_WAIT_TIMEOUT));
        const resourceDisplayInput = await fields[1].findElement(By.css('input'));
        await driver.wait(elementValueIs(resourceDisplayInput, 'on', DEFAULT_WAIT_TIMEOUT));

        await listDisplayInput.click();
        await driver.sleep(100);
        await driver.wait(elementIsClicked('.configure-field.save', DEFAULT_WAIT_TIMEOUT));
    });

    it('should have removed email from list', async () => {
        await driver.wait(until.elementLocated(By.css('.tab-dataset-resources')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(elementIsClicked('.tab-dataset-resources', DEFAULT_WAIT_TIMEOUT));
        await driver.wait(until.elementLocated(By.css('.dataset')), DEFAULT_WAIT_TIMEOUT);
        const headers = await driver.findElements(By.css('.dataset table th button'));

        const expectedHeaders = ['URI', 'FIRSTNAME', 'NAME', 'BEST FRIEND OF'];
        await Promise.all(headers.map(async (header, index) =>
            driver.wait(elementTextIs(header, expectedHeaders[index], DEFAULT_WAIT_TIMEOUT)),
        ));
    });

    it('should go to detail page when clicking on uri', async () => {
        await driver.wait(until.elementLocated(By.css('.tab-dataset-resources')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(elementIsClicked('.tab-dataset-resources'));

        const firstUriLink = await driver.findElement(By.linkText('uid:/1'));
        await driver.wait(elementIsClicked(firstUriLink), DEFAULT_WAIT_TIMEOUT);

        await driver.wait(until.elementLocated(By.css('.resource')));
    });

    it('should display all resource properties', async () => {
        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);

        const fullnameLabel = '.detail .property.full_name .property_label';
        await driver.wait(elementTextIs(fullnameLabel, 'Full name', DEFAULT_WAIT_TIMEOUT));

        const mailLabel = '.detail .property.email.completes_fullname .property_label';
        await driver.wait(elementTextIs(mailLabel, 'Email', DEFAULT_WAIT_TIMEOUT));

        const bestFriendLabel = '.detail .property.best_friend_of .property_label';
        await driver.wait(elementTextIs(bestFriendLabel, 'Best Friend Of', DEFAULT_WAIT_TIMEOUT));
    });

    it('should have an ontology tab on resource page', async () => {
        await driver.wait(until.elementLocated(By.css('.tab-resource-ontology')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(elementIsClicked('.tab-resource-ontology'));
        await driver.wait(until.elementLocated(By.css('.ontology')), DEFAULT_WAIT_TIMEOUT);

        expect(await driver.findElement(By.css('.ontology .field-label.uri')).getText()).toEqual('URI');
        expect(await driver.findElement(By.css('.ontology .field-scheme.uri')).getText()).toEqual('http://uri4uri.net/vocab#URI');
        expect(await driver.findElement(
            By.css('.ontology .field-cover.uri'),
        ).getText()).toEqual('Different for each resource');

        expect(await driver.findElement(By.css('.ontology .field-label.name')).getText()).toEqual('name');
        expect(await driver.findElement(
            By.css('.ontology .field-cover.name'),
        ).getText()).toEqual('Different for each resource');

        expect(await driver.findElement(By.css('.ontology .field-label.full_name')).getText()).toEqual('Full name');
        expect(await driver.findElement(By.css('.ontology .field-scheme.full_name')).getText()).toEqual('http://www.w3.org/ns/person');
        expect(await driver.findElement(
            By.css('.ontology .field-cover.full_name'),
        ).getText()).toEqual('Different for each resource');

        expect(await driver.findElement(By.css('.ontology .field-label.firstname')).getText()).toEqual('firstname');
        expect(await driver.findElement(
            By.css('.ontology .field-cover.firstname'),
        ).getText()).toEqual('Different for each resource');

        expect(await driver.findElement(By.css('.ontology .field-label.email')).getText()).toEqual('Email');
        expect(await driver.findElement(By.css('.ontology .field-scheme.email')).getText()).toEqual('http://uri4uri.net/vocab');
        expect(await driver.findElement(
            By.css('.ontology .field-cover.email'),
        ).getText()).toEqual('Different for each resource');

        expect(await driver.findElement(
            By.css('.ontology .field-label.best_friend_of'),
        ).getText()).toEqual('Best Friend Of');
        expect(await driver.findElement(By.css('.ontology .field-scheme.best_friend_of')).getText()).toEqual('http://www.w3.org/ns/person');
        expect(await driver.findElement(
            By.css('.ontology .field-cover.best_friend_of'),
        ).getText()).toEqual('Different for each resource');
        expect(await driver.findElement(
            By.css('.ontology .field-language.best_friend_of'),
        ).getText()).toEqual('Français');

        expect(await driver.findElement(By.css('.ontology .field-label.movie')).getText()).toEqual('Movie');
        expect(await driver.findElement(
            By.css('.ontology .field-cover.movie'),
        ).getText()).toEqual('Apply to whole dataset');

        expect(await driver.findElement(By.css('.ontology .field-label.author')).getText()).toEqual('Author');
        expect(await driver.findElement(
            By.css('.ontology .field-cover.author'),
        ).getText()).toEqual('Apply to whole dataset');
    });

    it('should display edit button once logged', async () => {
        const editButtons = await driver.findElements(By.css('.configure-field'));
        expect(editButtons.length).toBe(8);
    });

    it('should edit form for best friend field removing it from resource', async () => {
        await driver.wait(elementIsClicked('.configure-field.best_friend_of', DEFAULT_WAIT_TIMEOUT));
        await driver.wait(until.elementLocated(By.css('#field_form')));
        const fields = await driver.findElements(By.css('#field_form > div'));
        const listDisplayLabel = await fields[0].findElement(By.css('label'));
        await driver.wait(elementTextIs(listDisplayLabel, 'Display on list page', DEFAULT_WAIT_TIMEOUT));
        const listDisplayInput = await fields[0].findElement(By.css('input'));
        await driver.wait(elementValueIs(listDisplayInput, 'on', DEFAULT_WAIT_TIMEOUT));

        const resourceDisplayLabel = await fields[1].findElement(By.css('label'));
        await driver.wait(elementTextIs(resourceDisplayLabel, 'Display on resource page', DEFAULT_WAIT_TIMEOUT));
        const resourceDisplayInput = await fields[1].findElement(By.css('input'));
        await driver.wait(elementValueIs(resourceDisplayInput, 'on', DEFAULT_WAIT_TIMEOUT));

        await resourceDisplayInput.click();
        await driver.sleep(500);
        await driver.wait(elementIsClicked('.configure-field.save', DEFAULT_WAIT_TIMEOUT));
    });

    it('should not display best_friend_of anymore', async () => {
        await driver.wait(until.elementLocated(By.css('.tab-resource-details')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(elementIsClicked('.tab-resource-details', DEFAULT_WAIT_TIMEOUT));
        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);

        const fullnameLabel = '.detail .property.full_name .property_label';
        await driver.wait(elementTextIs(fullnameLabel, 'Full name', DEFAULT_WAIT_TIMEOUT));

        const mailLabel = '.detail .property.email.completes_fullname .property_label';
        await driver.wait(elementTextIs(mailLabel, 'Email', DEFAULT_WAIT_TIMEOUT));

        const bestFriendLabel = await driver.findElements(By.css('.detail .property.best_friend_of .property_label'));
        expect(bestFriendLabel.length).toBe(0);
    });

    after(async () => {
        await clear();
        await driver.executeScript('localStorage.clear();');
        await driver.executeScript('sessionStorage.clear();');
    });
});
