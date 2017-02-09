import { until, By } from 'selenium-webdriver';
import expect from 'expect';

import driver from '../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../common/tests/fixtures';
import fixtures from './home_published.json';

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
        tdsText.some(t => t === 'PEREGRIN.TOOK');
        tdsText.some(t => t === 'peregrin.took@shire.net');
    });

    after(async () => {
        await clear();
        await driver.executeScript('localStorage.clear();');
    });
});
