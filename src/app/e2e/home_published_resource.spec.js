import { until, By } from 'selenium-webdriver';
import expect from 'expect';

import {
    elementTextIs,
    elementsCountIs,
    elementIsClicked,
} from 'selenium-smart-wait';

import driver from '../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../common/tests/fixtures';
import fixtures from './home_published.json';
import navigate from './navigate';
import { inputElementIsFocusable } from '../../common/tests/conditions';

describe.only('Resource page', function homePublishedDataTests() {
    this.timeout(30000);
    const DEFAULT_WAIT_TIMEOUT = 19000; // A bit less than mocha's timeout to get explicit errors from selenium

    before(async () => {
        await clear();
        await loadFixtures(fixtures);
        await navigate('/uid:/1');
    });

    it('should not display moderate component when loggedOut', async () => {
        const moderateComponents = await driver.findElements(By.css('.moderate'));
        expect(moderateComponents.length).toBe(0);
    });

    it('should display all resource properties correctly ordered', async () => {
        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);

        const properties = await driver.findElements(By.css('.detail .property'));

        expect(properties.length).toEqual(5);
        expect(await properties[0].getAttribute('class')).toContain('best_friend_of');
        expect(await properties[1].getAttribute('class')).toContain('full_name');
    });

    it('should display all resource properties', async () => {
        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);

        const fullnameLabel = '.property_label.full_name';
        await driver.wait(elementTextIs(fullnameLabel, 'Full name', DEFAULT_WAIT_TIMEOUT));

        const fullnameScheme = '.property_scheme.full_name';
        await driver.wait(elementTextIs(fullnameScheme, 'http://www.w3.org/ns/person', DEFAULT_WAIT_TIMEOUT));

        await driver.wait(
            elementTextIs('.detail .property.full_name .compose_full_name.property.name .property_value', 'TOOK',
            DEFAULT_WAIT_TIMEOUT),
        );
        await driver.wait(
            elementTextIs('.detail .property.full_name .compose_full_name.property.firstname .property_value', 'PEREGRIN',
            DEFAULT_WAIT_TIMEOUT),
        );

        const mailLabel = '.detail .property.email.completes_fullname .property_label';
        await driver.wait(elementTextIs(mailLabel, 'Email', DEFAULT_WAIT_TIMEOUT));

        const mailScheme = '.detail .property.email.completes_fullname .property_scheme';
        await driver.wait(elementTextIs(mailScheme, 'http://uri4uri.net/vocab', DEFAULT_WAIT_TIMEOUT));

        const mailValue = '.detail .property.email.completes_fullname .property_value';
        await driver.wait(elementTextIs(mailValue, 'peregrin.took@shire.net', DEFAULT_WAIT_TIMEOUT));

        const bestFriendLabel = '.detail .property.best_friend_of .property_label';
        await driver.wait(elementTextIs(bestFriendLabel, 'Best Friend Of', DEFAULT_WAIT_TIMEOUT));

        const bestFriendScheme = '.detail .property.best_friend_of .property_scheme';
        await driver.wait(elementTextIs(bestFriendScheme, 'http://www.w3.org/ns/person', DEFAULT_WAIT_TIMEOUT));

        const bestFriendValue = '.detail .property.best_friend_of .property_value';
        await driver.wait(elementTextIs(bestFriendValue, 'MERIADOC', DEFAULT_WAIT_TIMEOUT));

        const bestFriendLanguage = '.detail .property.best_friend_of .property_language';
        await driver.wait(elementTextIs(bestFriendLanguage, 'FR', DEFAULT_WAIT_TIMEOUT));
    });

    it('should allow to add field resource properties', async () => {
        const addFieldResource = await driver.findElement(By.css('.add-field-resource'));
        await driver.wait(elementIsClicked(addFieldResource), DEFAULT_WAIT_TIMEOUT);

        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);
        const form = driver.findElement(By.css('#add_field_resource_form'));

        await driver.wait(until.elementLocated(By.css('.contributor-name input')), DEFAULT_WAIT_TIMEOUT);
        const contributorName = form.findElement(By.css('.contributor-name input'));
        contributorName.sendKeys('john');

        const contributorMail = form.findElement(By.css('.contributor-mail input'));
        contributorMail.sendKeys('john@doe.fr');

        const selectField = '.select-field';
        await driver.wait(elementIsClicked(selectField), DEFAULT_WAIT_TIMEOUT);
        await driver.sleep(500); // animations
        const newField = '.new';
        await driver.wait(elementIsClicked(newField), DEFAULT_WAIT_TIMEOUT);
        await driver.sleep(500); // animations

        await driver.wait(until.elementLocated(By.css('#add_field_resource_form .field-label input')), DEFAULT_WAIT_TIMEOUT);
        const fieldLabel = await form.findElement(By.css('#add_field_resource_form .field-label input'));
        await driver.wait(inputElementIsFocusable(fieldLabel, true), DEFAULT_WAIT_TIMEOUT);
        fieldLabel.sendKeys('my contribution');

        const fieldScheme = await form.findElement(By.css('#add_field_resource_form .field-scheme input'));
        await driver.wait(inputElementIsFocusable(fieldScheme, true), DEFAULT_WAIT_TIMEOUT);
        fieldScheme.sendKeys('http://vocab/field');

        const fieldValue = await form.findElement(By.css('#add_field_resource_form .field-value input'));
        await driver.wait(inputElementIsFocusable(fieldValue, true), DEFAULT_WAIT_TIMEOUT);
        fieldValue.sendKeys('my value');

        const addFieldButton = '.add-field-resource.save';
        await driver.wait(elementIsClicked(addFieldButton), DEFAULT_WAIT_TIMEOUT);
    });

    it('should display added field in new detail', async () => {
        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(elementsCountIs('.detail .property', 6), DEFAULT_WAIT_TIMEOUT);

        const contributionLabel = '.detail .property.my_contribution .property_label';
        await driver.wait(elementTextIs(contributionLabel, 'my contribution', DEFAULT_WAIT_TIMEOUT));

        const contributionContributor = '.detail .property.my_contribution .property_contributor';
        await driver.wait(elementTextIs(contributionContributor, 'Contributed by john', DEFAULT_WAIT_TIMEOUT));

        const contributionValue = '.detail .property.my_contribution .property_value';
        await driver.wait(elementTextIs(contributionValue, 'my value', DEFAULT_WAIT_TIMEOUT));
    });

    it('should have an ontology tab', async () => {
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

    it.only('should have an export tab', async () => {
        await driver.wait(until.elementLocated(By.css('.tab-resource-export')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(elementIsClicked('.tab-resource-export'));
        await driver.wait(until.elementLocated(By.css('.export')), DEFAULT_WAIT_TIMEOUT);

        expect(await driver.findElement(By.css('.export .btn-export.csv')).getText()).toMatch('Export as csv');
    });

    it.only('should have an export tab with a resource sharing link', async () => {
        await driver.wait(until.elementLocated(By.css('.share-link')), DEFAULT_WAIT_TIMEOUT);

        expect(await driver.findElement(By.css('.share-link input')).getAttribute('value')).toMatch(/.*\/uid:\/1/);
        await driver.wait(until.elementLocated(By.css('.share-link button')), DEFAULT_WAIT_TIMEOUT);
        expect(await driver.findElement(By.css('.share-link button')).getText()).toEqual('COPY');
    });

    it.only('should have an export tab with a widget', async () => {
        await driver.wait(until.elementLocated(By.css('.widget')), DEFAULT_WAIT_TIMEOUT);
        await driver.executeScript('document.getElementsByClassName("widget")[0].scrollIntoView(true);');
        let widgetCode = await driver.findElement(By.css('#share-widget')).getAttribute('value');
        expect(widgetCode).toMatch(/.+\/api\/widget\?type=.+&uri=.+&fields=%5B%5D/);

        await driver.findElement(By.css('.widget-select-field')).click();
        await driver.sleep(500); // animations
        await driver.executeScript('document.querySelector(".widget-select-field-item.name").scrollIntoView(true);');
        await driver.findElement(By.css('.widget-select-field-item.name')).click();
        await driver.sleep(500); // animations
        await driver.findElement(By.css('.btn-apply-widget-select')).click();
        await driver.sleep(500); // animations

        await driver.wait(until.elementLocated(By.css('.widget-selected-field-item.name')), DEFAULT_WAIT_TIMEOUT);

        widgetCode = await driver.findElement(By.css('#share-widget')).getAttribute('value');
        expect(widgetCode).toMatch(/.+\/api\/widget\?type=.+&uri=.+&fields=%5B%22name%22%5D/);
    });

    it('should have an export tab with resource social sharing buttons', async () => {
        await driver.wait(until.elementLocated(By.css('.share')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.share .share-facebook')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.share .share-google')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.share .share-twitter')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.share .share-linkedin')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.share .share-whatsapp')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.share .share-vk')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.share .share-telegram')), DEFAULT_WAIT_TIMEOUT);
    });

    after(async () => {
        await clear();
        await driver.executeScript('localStorage.clear();');
        await driver.executeScript('sessionStorage.clear();');
    });
});
