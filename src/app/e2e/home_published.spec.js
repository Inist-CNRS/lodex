import { until, By } from 'selenium-webdriver';
import expect from 'expect';
import {
    elementTextIs,
    elementsCountIs,
    elementIsClicked,
    stalenessOf,
} from 'selenium-smart-wait';

import driver from '../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../common/tests/fixtures';
import fixtures from './home_published.json';
import { inputElementIsFocusable } from '../../common/tests/conditions';

describe.only('Home page with published data', function homePublishedDataTests() {
    this.timeout(30000);
    const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

    before(async () => {
        await clear();
        await loadFixtures(fixtures);
        await driver.get('http://localhost:3100/');
    });

    it('should display the dataset characteristics', async () => {
        await driver.wait(until.elementLocated(By.css('.dataset-characteristics')), DEFAULT_WAIT_TIMEOUT);
        const datasetCharacteristics = await driver.findElements(By.css('.dataset-characteristics'));
        expect(datasetCharacteristics.length).toEqual(1);
        const properties = await driver.findElements(By.css('.dataset-characteristics .property'));
        expect(properties.length).toEqual(2);

        const movieLabel = '.dataset-characteristics .property.movie .property_name';
        driver.wait(elementTextIs(movieLabel, 'Movie'), DEFAULT_WAIT_TIMEOUT);

        const movieValue = '.dataset-characteristics .property.movie .property_value';
        driver.wait(elementTextIs(movieValue, 'LOTR'), DEFAULT_WAIT_TIMEOUT);

        const authorLabel = '.dataset-characteristics .property.author.completes_movie .property_name';
        driver.wait(elementTextIs(authorLabel, 'Author'), DEFAULT_WAIT_TIMEOUT);

        const authorValue = '.dataset-characteristics .property.author.completes_movie .property_value';
        driver.wait(elementTextIs(authorValue, 'Peter Jackson'), DEFAULT_WAIT_TIMEOUT);
    });

    it('should display the list', async () => {
        await driver.wait(until.elementLocated(By.css('.dataset')), DEFAULT_WAIT_TIMEOUT);
        const headers = await driver.findElements(By.css('.dataset table th button'));

        const expectedHeaders = ['URI', 'NAME', 'FIRSTNAME', 'EMAIL', 'BEST FRIEND OF'];
        await Promise.all(headers.map((header, index) =>
            driver.wait(elementTextIs(header, expectedHeaders[index]), DEFAULT_WAIT_TIMEOUT),
        ));

        const expectedTds = [
            ['1', 'TOOK', 'PEREGRIN', 'peregrin.took@shire.net'],
            ['2', 'GAMGIE', 'SAMSAGET', 'samsaget.gamgie@shire.net'],
            ['3', 'BAGGINS', 'BILBON', 'bilbon.saquet@shire.net'],
            ['4', 'BAGGINS', 'FRODO', 'frodo.saquet@shire.net'],
            ['5', 'BRANDYBUCK', 'MERIADOC', 'meriadoc.brandybuck@shire.net'],
        ];

        const trs = await driver.findElements(By.css('.dataset table tbody tr'));
        await Promise.all(trs.map(tr => tr
            .findElements(By.css('td'))
            .then(tds => Promise.all(tds.map(td => td.getText())))
            .then((tdsText) => {
                const item = expectedTds.find(td => td.every((cell, index) => cell === tdsText[index]));
                expect(item).toExist('Unexpected row');
            }),
        ));
    });

    it('should sort the list by firstname', async () => {
        const firstnameHeader = '.sort_firstname';
        await driver.wait(elementIsClicked(firstnameHeader));
        const expectedTds = [
            ['3', 'BAGGINS', 'BILBON', 'bilbon.saquet@shire.net'],
            ['4', 'BAGGINS', 'FRODO', 'frodo.saquet@shire.net'],
            ['5', 'BRANDYBUCK', 'MERIADOC', 'meriadoc.brandybuck@shire.net'],
            ['1', 'TOOK', 'PEREGRIN', 'peregrin.took@shire.net'],
            ['2', 'GAMGIE', 'SAMSAGET', 'samsaget.gamgie@shire.net'],
        ];

        const trs = await driver.findElements(By.css('.dataset table tbody tr'));
        await Promise.all(trs.map(tr => tr
            .findElements(By.css('td'))
            .then(tds => Promise.all(tds.map(td => td.getText())))
            .then((tdsText) => {
                const item = expectedTds.find(td => td.every((cell, index) => cell === tdsText[index]));
                expect(item).toExist('Unexpected row');
            }),
        ));
    });

    it('should sort the list by name', async () => {
        const nameHeader = '.sort_name';
        await driver.wait(elementIsClicked(nameHeader));
        const expectedTds = [
            ['3', 'BAGGINS', 'BILBON', 'bilbon.saquet@shire.net'],
            ['4', 'BAGGINS', 'FRODO', 'frodo.saquet@shire.net'],
            ['5', 'BRANDYBUCK', 'MERIADOC', 'meriadoc.brandybuck@shire.net'],
            ['2', 'GAMGIE', 'SAMSAGET', 'samsaget.gamgie@shire.net'],
            ['1', 'TOOK', 'PEREGRIN', 'peregrin.took@shire.net'],
        ];

        const trs = await driver.findElements(By.css('.dataset table tbody tr'));
        await Promise.all(trs.map(tr => tr
            .findElements(By.css('td'))
            .then(tds => Promise.all(tds.map(td => td.getText())))
            .then((tdsText) => {
                const item = expectedTds.find(td => td.every((cell, index) => cell === tdsText[index]));
                expect(item).toExist('Unexpected row');
            }),
        ));
    });

    it('should invert the order', async () => {
        const nameHeader = '.sort_name';
        await driver.wait(elementIsClicked(nameHeader));
        const expectedTds = [
            ['1', 'TOOK', 'PEREGRIN', 'peregrin.took@shire.net'],
            ['2', 'GAMGIE', 'SAMSAGET', 'samsaget.gamgie@shire.net'],
            ['5', 'BRANDYBUCK', 'MERIADOC', 'meriadoc.brandybuck@shire.net'],
            ['4', 'BAGGINS', 'FRODO', 'frodo.saquet@shire.net'],
            ['3', 'BAGGINS', 'BILBON', 'bilbon.saquet@shire.net'],
        ];

        const trs = await driver.findElements(By.css('.dataset table tbody tr'));
        await Promise.all(trs.map(tr => tr
            .findElements(By.css('td'))
            .then(tds => Promise.all(tds.map(td => td.getText())))
            .then((tdsText) => {
                const item = expectedTds.find(td => td.every((cell, index) => cell === tdsText[index]));
                expect(item).toExist('Unexpected row');
            }),
        ));
    });

    it('should filter list', async () => {
        await driver.wait(until.elementLocated(By.css('.filter input')), DEFAULT_WAIT_TIMEOUT);
        const filterInput = driver.findElement(By.css('.filter input'));
        await filterInput.sendKeys('baggins');

        const spinner = '.dataset-loading';
        await driver.wait(stalenessOf(spinner), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.dataset table tbody tr')), DEFAULT_WAIT_TIMEOUT);

        const expectedTds = [
            ['3', 'BAGGINS', 'BILBON', 'bilbon.saquet@shire.net'],
            ['4', 'BAGGINS', 'FRODO', 'frodo.saquet@shire.net'],
        ];

        const trs = await driver.findElements(By.css('.dataset table tbody tr'));
        await Promise.all(trs.map(tr => tr
            .findElements(By.css('td'))
            .then(tds => Promise.all(tds.map(td => td.getText())))
            .then((tdsText) => {
                const item = expectedTds.find(td => td.every((cell, index) => cell === tdsText[index]));
                expect(item).toExist('Unexpected row');
            }),
        ));
    });

    it('should display `No matching resource found`', async () => {
        await driver.wait(until.elementLocated(By.css('.filter input')), DEFAULT_WAIT_TIMEOUT);
        const filterInput = driver.findElement(By.css('.filter input'));

        await filterInput.clear();
        await filterInput.sendKeys('sauron');

        const spinner = '.dataset-loading';
        await driver.wait(stalenessOf(spinner), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.dataset table tbody')), DEFAULT_WAIT_TIMEOUT);

        const tbody = '.dataset table tbody';

        await driver.wait(elementTextIs(tbody, 'No matching resource found'), DEFAULT_WAIT_TIMEOUT);
    });

    it('should clear filter', async () => {
        await driver.wait(until.elementLocated(By.css('.filter input')), DEFAULT_WAIT_TIMEOUT);
        const filterInput = driver.findElement(By.css('.filter input'));
        await filterInput.clear();
        await filterInput.sendKeys(' \b'); // clear do not trigger onChange event forcing it (\b is backspace)

        const spinner = '.dataset-loading';
        await driver.wait(stalenessOf(spinner), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.dataset table tbody tr')), DEFAULT_WAIT_TIMEOUT);

        await driver.wait(elementsCountIs('.dataset table tbody tr', 5));
    });

    it('should filter list from facet', async () => {
        await driver.wait(until.elementLocated(By.css('.facet-selector')), DEFAULT_WAIT_TIMEOUT);
        const facetSelector = '.facet-selector';
        await driver.wait(elementIsClicked(facetSelector), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.facet-name')), DEFAULT_WAIT_TIMEOUT);
        const facet = '.facet-name';
        await driver.wait(elementIsClicked(facet), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.facet-value-selector input')), DEFAULT_WAIT_TIMEOUT);
        const facetValueSelector = '.facet-value-selector input';
        await driver.wait(elementIsClicked(facetValueSelector), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.facet-value-baggins')), DEFAULT_WAIT_TIMEOUT);
        const facetValue = '.facet-value-baggins';
        await driver.wait(elementIsClicked(facetValue), DEFAULT_WAIT_TIMEOUT);

        const spinner = '.dataset-loading';
        await driver.wait(stalenessOf(spinner), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.dataset table tbody tr')), DEFAULT_WAIT_TIMEOUT);

        const expectedTds = [
            ['3', 'BAGGINS', 'BILBON', 'bilbon.saquet@shire.net'],
            ['4', 'BAGGINS', 'FRODO', 'frodo.saquet@shire.net'],
        ];

        const trs = await driver.findElements(By.css('.dataset table tbody tr'));
        await Promise.all(trs.map(tr => tr
            .findElements(By.css('td'))
            .then(tds => Promise.all(tds.map(td => td.getText())))
            .then((tdsText) => {
                const item = expectedTds.find(td => td.every((cell, index) => cell === tdsText[index]));
                expect(item).toExist('Unexpected row');
            }),
        ));
    });

    it('should clear filter', async () => {
        await driver.wait(until.elementLocated(By.css('.applied-facet-name svg')), DEFAULT_WAIT_TIMEOUT);
        const facetClear = '.applied-facet-name svg';
        await driver.wait(elementIsClicked(facetClear), DEFAULT_WAIT_TIMEOUT);

        await driver.wait(until.elementLocated(By.css('.dataset table tbody tr')), DEFAULT_WAIT_TIMEOUT);

        await driver.wait(elementsCountIs('.dataset table tbody tr', 5), DEFAULT_WAIT_TIMEOUT);
    });

    it('should go to detail page when clicking on uri', async () => {
        const firstUriLink = await driver.findElement(By.linkText('1'));
        const firstUri = await firstUriLink.getText();
        await driver.wait(elementIsClicked(firstUriLink), DEFAULT_WAIT_TIMEOUT);

        await driver.wait(until.elementLocated(By.css('.title')));
        const title = await driver.findElement(By.css('.title, h1'), DEFAULT_WAIT_TIMEOUT);
        driver.wait(elementTextIs(title, firstUri), DEFAULT_WAIT_TIMEOUT);
    });

    it('should not display moderate component when loggedOut', async () => {
        const moderateComponents = await driver.findElements(By.css('.moderate'));
        expect(moderateComponents.length).toBe(0);
    });

    it('should display all resource properties', async () => {
        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);

        const fullnameLabel = '.detail .property.full_name .property_name';
        await driver.wait(elementTextIs(fullnameLabel, 'Full name'), DEFAULT_WAIT_TIMEOUT);

        const fullnameScheme = '.detail .property.full_name > .property_scheme';
        await driver.wait(elementTextIs(fullnameScheme, 'http://www.w3.org/ns/person'), DEFAULT_WAIT_TIMEOUT);

        const fullnameValue = '.detail .property.full_name .composite_property_value';
        await driver.wait(elementTextIs(fullnameValue, 'PEREGRIN.TOOK'), DEFAULT_WAIT_TIMEOUT);

        const mailLabel = '.detail .property.email.completes_fullname .property_name';
        await driver.wait(elementTextIs(mailLabel, 'Email'), DEFAULT_WAIT_TIMEOUT);

        const mailScheme = '.detail .property.email.completes_fullname > .property_scheme';
        await driver.wait(elementTextIs(mailScheme, 'http://uri4uri.net/vocab'), DEFAULT_WAIT_TIMEOUT);

        const mailValue = '.detail .property.email.completes_fullname .property_value';
        await driver.wait(elementTextIs(mailValue, 'peregrin.took@shire.net'), DEFAULT_WAIT_TIMEOUT);

        const bestFriendLabel = '.detail .property.best_friend_of .property_name';
        await driver.wait(elementTextIs(bestFriendLabel, 'Best Friend Of'), DEFAULT_WAIT_TIMEOUT);

        const bestFriendScheme = '.detail .property.best_friend_of > .property_scheme';
        await driver.wait(elementTextIs(bestFriendScheme, 'http://www.w3.org/ns/person'), DEFAULT_WAIT_TIMEOUT);

        const bestFriendValue = '.detail .property.best_friend_of .property_value';
        await driver.wait(elementTextIs(bestFriendValue, 'MERIADOC'), DEFAULT_WAIT_TIMEOUT);

        const bestFriendLanguage = '.detail .property.best_friend_of .property_language';
        await driver.wait(elementTextIs(bestFriendLanguage, '(Français)'), DEFAULT_WAIT_TIMEOUT);
    });

    it('should allow to add field resource properties', async () => {
        const addFieldResource = await driver.findElement(By.css('.add-field-resource'));
        await driver.wait(elementIsClicked(addFieldResource), DEFAULT_WAIT_TIMEOUT);

        await driver.wait(until.elementLocated(By.css('.detail-properties')), DEFAULT_WAIT_TIMEOUT);
        const form = driver.findElement(By.css('#add_field_resource_form'));

        await driver.wait(until.elementLocated(By.css('.contributor-name input')), DEFAULT_WAIT_TIMEOUT);
        const contributorName = form.findElement(By.css('.contributor-name input'));
        await driver.wait(inputElementIsFocusable(contributorName, true), DEFAULT_WAIT_TIMEOUT);
        contributorName.sendKeys('john');

        const contributorMail = form.findElement(By.css('.contributor-mail input'));
        await driver.wait(inputElementIsFocusable(contributorMail, true), DEFAULT_WAIT_TIMEOUT);
        contributorMail.sendKeys('john@doe.fr');

        const selectField = '.select-field';
        await driver.wait(elementIsClicked(selectField), DEFAULT_WAIT_TIMEOUT);
        const newField = '.new';
        await driver.wait(elementIsClicked(newField), DEFAULT_WAIT_TIMEOUT);

        const fieldLabel = form.findElement(By.css('.field-label input'));
        await driver.wait(inputElementIsFocusable(fieldLabel, true), DEFAULT_WAIT_TIMEOUT);
        fieldLabel.sendKeys('my contribution');

        const fieldScheme = form.findElement(By.css('.field-scheme input'));
        await driver.wait(inputElementIsFocusable(fieldScheme, true), DEFAULT_WAIT_TIMEOUT);
        fieldScheme.sendKeys('http://vocab/field');

        const fieldValue = form.findElement(By.css('.field-value input'));
        await driver.wait(inputElementIsFocusable(fieldValue, true), DEFAULT_WAIT_TIMEOUT);
        fieldValue.sendKeys('my value');

        const addFieldButton = '.add-field-to-resource';
        await driver.wait(elementIsClicked(addFieldButton), DEFAULT_WAIT_TIMEOUT);
    });

    it('should display added field in new detail', async () => {
        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(elementsCountIs('.detail .property', 4), DEFAULT_WAIT_TIMEOUT);

        const contributionLabel = '.detail .property.my_contribution .property_name';
        await driver.wait(elementTextIs(contributionLabel, 'my contribution'), DEFAULT_WAIT_TIMEOUT);

        const contributionContributor = '.detail .property.my_contribution .property_contributor';
        await driver.wait(elementTextIs(contributionContributor, 'Contributed by john'), DEFAULT_WAIT_TIMEOUT);

        const contributionValue = '.detail .property.my_contribution .property_value';
        await driver.wait(elementTextIs(contributionValue, 'my value'), DEFAULT_WAIT_TIMEOUT);
    });

    after(async () => {
        await clear();
        await driver.executeScript('localStorage.clear();');
        await driver.executeScript('sessionStorage.clear();');
    });
});
