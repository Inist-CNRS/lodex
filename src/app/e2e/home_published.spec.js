import { until, By } from 'selenium-webdriver';
import expect from 'expect';

import driver from '../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../common/tests/fixtures';
import fixtures from './home_published.json';
import { inputElementIsFocusable, elementsCountIs, elementIsClicked } from '../../common/tests/conditions';

describe('Home page with published data', function homePublishedDataTests() {
    this.timeout(100000);
    const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

    before(async () => {
        await clear();
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
            By.css('.dataset-characteristics .property.movie .property_name'),
        );
        driver.wait(until.elementTextIs(movieLabel, 'Movie'), DEFAULT_WAIT_TIMEOUT);

        const movieValue = await driver.findElement(By.css('.dataset-characteristics .property.movie .property_value'));
        driver.wait(until.elementTextIs(movieValue, 'LOTR'), DEFAULT_WAIT_TIMEOUT);

        const authorLabel = await driver.findElement(
            By.css('.dataset-characteristics .property.author.completes_movie .property_name'),
        );
        driver.wait(until.elementTextIs(authorLabel, 'Author'), DEFAULT_WAIT_TIMEOUT);

        const authorValue = await driver.findElement(
            By.css('.dataset-characteristics .property.author.completes_movie .property_value'),
        );
        driver.wait(until.elementTextIs(authorValue, 'Peter Jackson'), DEFAULT_WAIT_TIMEOUT);
    });

    it('should display the list', async () => {
        await driver.wait(until.elementLocated(By.css('.dataset')), DEFAULT_WAIT_TIMEOUT);
        const headers = await driver.findElements(By.css('.dataset table th'));

        const expectedHeaders = ['URI', 'name', 'firstname', 'Email', 'Best Friend Of'];
        await Promise.all(headers.map((header, index) =>
            driver.wait(until.elementTextIs(header, expectedHeaders[index]), DEFAULT_WAIT_TIMEOUT),
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

    it('should filter list', async () => {
        await driver.wait(until.elementLocated(By.css('.filter input')), DEFAULT_WAIT_TIMEOUT);
        const filterInput = driver.findElement(By.css('.filter input'));
        await filterInput.sendKeys('baggins');

        const spinner = await driver.findElement(By.css('.spinner')).catch(() => null);
        await driver.wait(until.stalenessOf(spinner)).catch(() => null);

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

        const spinner = await driver.findElement(By.css('.spinner')).catch(() => null);
        await driver.wait(until.stalenessOf(spinner)).catch(() => null);

        const tbody = await driver.findElement(By.css('.dataset table tbody'));
        expect(await tbody.getText()).toBe('No matching resource found');
    });

    it('should clear filter', async () => {
        await driver.wait(until.elementLocated(By.css('.filter input')), DEFAULT_WAIT_TIMEOUT);
        const filterInput = driver.findElement(By.css('.filter input'));
        await filterInput.clear();
        await filterInput.sendKeys(' \b'); // clear do not trigger onChange event forcing it (\b is backspace)

        const spinner = await driver.findElement(By.css('.spinner')).catch(() => null);
        await driver.wait(until.stalenessOf(spinner)).catch(() => null);

        const trs = await driver.findElements(By.css('.dataset table tbody tr'));
        expect(trs.length).toBe(5);
    });

    it('should go to detail page when clicking on uri', async () => {
        const firstUriLink = await driver.findElement(By.linkText('1'));
        const firstUri = await firstUriLink.getText();
        await driver.wait(elementIsClicked(firstUriLink), DEFAULT_WAIT_TIMEOUT);

        await driver.wait(until.elementLocated(By.css('.title')));
        const title = await driver.findElement(By.css('.title, h1'), DEFAULT_WAIT_TIMEOUT);
        driver.wait(until.elementTextIs(title, firstUri), DEFAULT_WAIT_TIMEOUT);
    });

    it('should not display moderate component when loggedOut', async () => {
        const moderateComponents = await driver.findElements(By.css('.moderate'));
        expect(moderateComponents.length).toBe(0);
    });

    it('should display all resource properties', async () => {
        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);
        const fullnameLabel = await driver.findElement(By.css('.detail .property.full_name .property_name'));
        await driver.wait(until.elementTextIs(fullnameLabel, 'Full name'), DEFAULT_WAIT_TIMEOUT);
        const fullnameScheme = await driver.findElement(By.css('.detail .property.full_name > .property_scheme'));
        await driver.wait(until.elementTextIs(fullnameScheme, 'http://www.w3.org/ns/person'), DEFAULT_WAIT_TIMEOUT);

        const fullnameValue = await driver.findElement(By.css('.detail .property.full_name .composite_property_value'));
        await driver.wait(until.elementTextIs(fullnameValue, 'PEREGRIN.TOOK'), DEFAULT_WAIT_TIMEOUT);

        const mailLabel = await driver.findElement(By.css('.detail .property.email.completes_fullname .property_name'));
        await driver.wait(until.elementTextIs(mailLabel, 'Email'), DEFAULT_WAIT_TIMEOUT);
        const mailScheme = await driver.findElement(
            By.css('.detail .property.email.completes_fullname > .property_scheme'),
        );
        await driver.wait(until.elementTextIs(mailScheme, 'http://uri4uri.net/vocab'), DEFAULT_WAIT_TIMEOUT);
        const mailValue = await driver.findElement(
            By.css('.detail .property.email.completes_fullname .property_value'),
        );
        await driver.wait(until.elementTextIs(mailValue, 'peregrin.took@shire.net'), DEFAULT_WAIT_TIMEOUT);

        const bestFriendLabel = await driver.findElement(By.css('.detail .property.best_friend_of .property_name'));
        await driver.wait(until.elementTextIs(bestFriendLabel, 'Best Friend Of'), DEFAULT_WAIT_TIMEOUT);
        const bestFriendScheme = await driver.findElement(
            By.css('.detail .property.best_friend_of > .property_scheme'),
        );
        await driver.wait(until.elementTextIs(bestFriendScheme, 'http://www.w3.org/ns/person'), DEFAULT_WAIT_TIMEOUT);
        const bestFriendValue = await driver.findElement(By.css('.detail .property.best_friend_of .property_value'));
        await driver.wait(until.elementTextIs(bestFriendValue, 'MERIADOC'), DEFAULT_WAIT_TIMEOUT);
        const bestFriendLanguage = await driver.findElement(
            By.css('.detail .property.best_friend_of .property_language'),
        );
        await driver.wait(until.elementTextIs(bestFriendLanguage, '(Français)'), DEFAULT_WAIT_TIMEOUT);
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

        const selectField = form.findElement(By.css('.select-field'));
        await driver.wait(elementIsClicked(selectField), DEFAULT_WAIT_TIMEOUT);
        const newField = await driver.findElement(By.css('.new'));
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

        const addFieldButton = await driver.findElement(By.css('.add-field-to-resource'));
        await driver.wait(elementIsClicked(addFieldButton), DEFAULT_WAIT_TIMEOUT);
    });

    it('should display added field in new detail', async () => {
        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(elementsCountIs(By.css('.detail .property'), 4), DEFAULT_WAIT_TIMEOUT);

        const contributionLabel = await driver.findElement(By.css('.detail .property.my_contribution .property_name'));
        await driver.wait(until.elementTextIs(contributionLabel, 'my contribution'), DEFAULT_WAIT_TIMEOUT);
        const contributionContributor = await driver.findElement(
            By.css('.detail .property.my_contribution .property_contributor'),
        );
        await driver.wait(until.elementTextIs(contributionContributor, 'Contributed by john'), DEFAULT_WAIT_TIMEOUT);

        const contributionValue = await driver.findElement(By.css('.detail .property.my_contribution .property_value'));
        await driver.wait(until.elementTextIs(contributionValue, 'my value'), DEFAULT_WAIT_TIMEOUT);
    });

    after(async () => {
        await clear();
        await driver.executeScript('localStorage.clear();');
        await driver.executeScript('sessionStorage.clear();');
    });
});
