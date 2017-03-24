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

describe('Home page with published data', function homePublishedDataTests() {
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

        const movieLabel = '.dataset-characteristics .property.movie .property_label';
        driver.wait(elementTextIs(movieLabel, 'Movie', DEFAULT_WAIT_TIMEOUT));

        const movieValue = '.dataset-characteristics .property.movie .property_value';
        driver.wait(elementTextIs(movieValue, 'LOTR', DEFAULT_WAIT_TIMEOUT));

        const authorLabel = '.dataset-characteristics .property.author.completes_movie .property_label';
        driver.wait(elementTextIs(authorLabel, 'Author', DEFAULT_WAIT_TIMEOUT));

        const authorValue = '.dataset-characteristics .property.author.completes_movie .property_value';
        driver.wait(elementTextIs(authorValue, 'Peter Jackson', DEFAULT_WAIT_TIMEOUT));
    });

    it('should display the list', async () => {
        await driver.wait(until.elementLocated(By.css('.dataset')), DEFAULT_WAIT_TIMEOUT);
        const headers = await driver.findElements(By.css('.dataset table th button'));

        const expectedHeaders = ['URI', 'FIRSTNAME', 'NAME', 'EMAIL', 'BEST FRIEND OF'];
        await Promise.all(headers.map((header, index) =>
            driver.wait(elementTextIs(header, expectedHeaders[index], DEFAULT_WAIT_TIMEOUT)),
        ));

        const expectedTds = [
            ['1', 'PEREGRIN', 'TOOK', 'peregrin.took@shire.net'],
            ['2', 'SAMSAGET', 'GAMGIE', 'samsaget.gamgie@shire.net'],
            ['3', 'BILBON', 'BAGGINS', 'bilbon.saquet@shire.net'],
            ['4', 'FRODO', 'BAGGINS', 'frodo.saquet@shire.net'],
            ['5', 'MERIADOC', 'BRANDYBUCK', 'meriadoc.brandybuck@shire.net'],
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
            ['3', 'BILBON', 'BAGGINS', 'bilbon.saquet@shire.net'],
            ['4', 'FRODO', 'BAGGINS', 'frodo.saquet@shire.net'],
            ['5', 'MERIADOC', 'BRANDYBUCK', 'meriadoc.brandybuck@shire.net'],
            ['1', 'PEREGRIN', 'TOOK', 'peregrin.took@shire.net'],
            ['2', 'SAMSAGET', 'GAMGIE', 'samsaget.gamgie@shire.net'],
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
            ['3', 'BILBON', 'BAGGINS', 'bilbon.saquet@shire.net'],
            ['4', 'FRODO', 'BAGGINS', 'frodo.saquet@shire.net'],
            ['5', 'MERIADOC', 'BRANDYBUCK', 'meriadoc.brandybuck@shire.net'],
            ['2', 'SAMSAGET', 'GAMGIE', 'samsaget.gamgie@shire.net'],
            ['1', 'PEREGRIN', 'TOOK', 'peregrin.took@shire.net'],
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
            ['1', 'PEREGRIN', 'TOOK', 'peregrin.took@shire.net'],
            ['2', 'SAMSAGET', 'GAMGIE', 'samsaget.gamgie@shire.net'],
            ['5', 'MERIADOC', 'BRANDYBUCK', 'meriadoc.brandybuck@shire.net'],
            ['4', 'FRODO', 'BAGGINS', 'frodo.saquet@shire.net'],
            ['3', 'BILBON', 'BAGGINS', 'bilbon.saquet@shire.net'],
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
        const spinner = await driver.findElement(By.css('.dataset-loading')).catch(() => null);
        if (spinner) {
            await driver.wait(stalenessOf(spinner, DEFAULT_WAIT_TIMEOUT));
        }
        await driver.wait(until.elementLocated(By.css('.dataset table tbody tr')), DEFAULT_WAIT_TIMEOUT);

        const expectedTds = [
            ['3', 'BILBON', 'BAGGINS', 'bilbon.saquet@shire.net'],
            ['4', 'FRODO', 'BAGGINS', 'frodo.saquet@shire.net'],
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

        const spinner = await driver.findElement(By.css('.dataset-loading')).catch(() => null);
        if (spinner) {
            await driver.wait(stalenessOf(spinner, DEFAULT_WAIT_TIMEOUT));
        }
        await driver.wait(until.elementLocated(By.css('.dataset table tbody')), DEFAULT_WAIT_TIMEOUT);

        const tbody = '.dataset table tbody';

        await driver.wait(elementTextIs(tbody, 'No matching resource found', DEFAULT_WAIT_TIMEOUT));
    });

    it('should clear filter', async () => {
        await driver.wait(until.elementLocated(By.css('.filter input')), DEFAULT_WAIT_TIMEOUT);
        const filterInput = driver.findElement(By.css('.filter input'));
        await filterInput.clear();
        await filterInput.sendKeys(' \b'); // clear do not trigger onChange event forcing it (\b is backspace)

        const spinner = await driver.findElement(By.css('.dataset-loading')).catch(() => null);
        if (spinner) {
            await driver.wait(stalenessOf(spinner, DEFAULT_WAIT_TIMEOUT));
        }
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

        const spinner = await driver.findElement(By.css('.dataset-loading')).catch(() => null);
        if (spinner) {
            await driver.wait(stalenessOf(spinner, DEFAULT_WAIT_TIMEOUT));
        }
        await driver.wait(until.elementLocated(By.css('.dataset table tbody tr')), DEFAULT_WAIT_TIMEOUT);

        const expectedTds = [
            ['3', 'BILBON', 'BAGGINS', 'bilbon.saquet@shire.net'],
            ['4', 'FRODO', 'BAGGINS', 'frodo.saquet@shire.net'],
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

    it('should have an export tab', async () => {
        await driver.wait(until.elementLocated(By.css('.tab-dataset-export')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(elementIsClicked('.tab-dataset-export'));
        await driver.wait(until.elementLocated(By.css('.export')), DEFAULT_WAIT_TIMEOUT);

        expect(await driver.findElement(By.css('.export .btn-export.csv')).getText()).toMatch('Export as csv');
    });

    it('should have an export tab with a sharing link', async () => {
        await driver.wait(until.elementLocated(By.css('.share-link')), DEFAULT_WAIT_TIMEOUT);

        expect(await driver.findElement(By.css('.share-link input')).getAttribute('value')).toEqual('http://localhost:3100/#/home');
        await driver.wait(until.elementLocated(By.css('.share-link button')), DEFAULT_WAIT_TIMEOUT);
        expect(await driver.findElement(By.css('.share-link button')).getText()).toEqual('COPY');
    });

    it('should have an export tab with social sharing buttons', async () => {
        await driver.wait(until.elementLocated(By.css('.share')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.share .share-facebook')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.share .share-google')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.share .share-twitter')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.share .share-linkedin')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.share .share-whatsapp')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.share .share-vk')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(until.elementLocated(By.css('.share .share-telegram')), DEFAULT_WAIT_TIMEOUT);
    });

    it('should go to detail page when clicking on uri', async () => {
        await driver.wait(until.elementLocated(By.css('.tab-dataset-resources')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(elementIsClicked('.tab-dataset-resources'));

        const firstUriLink = await driver.findElement(By.linkText('1'));
        await driver.wait(elementIsClicked(firstUriLink), DEFAULT_WAIT_TIMEOUT);

        await driver.wait(until.elementLocated(By.css('.resource')));
    });

    after(async () => {
        await clear();
        await driver.executeScript('localStorage.clear();');
        await driver.executeScript('sessionStorage.clear();');
    });
});
