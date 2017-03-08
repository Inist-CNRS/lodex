import { until, By } from 'selenium-webdriver';
import expect from 'expect';

import driver from '../../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../../common/tests/fixtures';
import fixtures from './contributedResources.json';
import { elementIsClicked } from '../../../common/tests/conditions';
import loginAsJulia from '../loginAsJulia';

describe('Admin', () => {
    describe.only('Contributed Resource management', function homePublishedDataTests() {
        this.timeout(30000);
        const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

        before(async () => {
            await clear(); // Had to ensure clear state for unknown reason
            await loadFixtures(fixtures);
            await loginAsJulia('/admin', '/');
        });

        it('should display the proposed contributed resources', async () => {
            await driver.wait(until.elementLocated(By.css('.contributed_resources')), DEFAULT_WAIT_TIMEOUT);
            const headers = await driver.findElements(By.css('.contributed_resources table th'));
            const headersText = await Promise.all(headers.map(h => h.getText()));
            expect(headersText).toEqual(['', 'URI', 'Full name', 'Email']);
            const trs = await driver.findElements(By.css('.contributed_resources table tbody tr'));
            expect(trs.length).toEqual(2);

            const tds = await driver.findElements(By.css('.contributed_resources table tbody td'));

            const tdsText = await Promise.all(tds.map(td => td.getText()));
            expect(tdsText.some(t => t === 'PEREGRIN.TOOK')).toEqual(true);
            expect(tdsText.some(t => t === 'peregrin.took@shire.net')).toEqual(true);
            expect(tdsText.some(t => t === 'SAMSAGET.GAMGIE')).toEqual(true);
            expect(tdsText.some(t => t === 'samsaget.gamgie@shire.net')).toEqual(true);
        });

        it('should filter the validated contributed resources', async () => {
            const filter = await driver.findElement(By.css('.contributed_resources .filter'));
            await driver.wait(elementIsClicked(filter), DEFAULT_WAIT_TIMEOUT);

            await driver.wait(until.elementLocated(By.css('.filter_VALIDATED')), DEFAULT_WAIT_TIMEOUT);
            const filterValidated = await driver.findElement(By.css('.filter_VALIDATED'));
            await driver.wait(elementIsClicked(filterValidated), DEFAULT_WAIT_TIMEOUT);
        });

        it('should display the validated contributed resources', async () => {
            await driver.wait(until.elementLocated(By.css('.contributed_resources')), DEFAULT_WAIT_TIMEOUT);
            const headers = await driver.findElements(By.css('.contributed_resources table th'));
            const headersText = await Promise.all(headers.map(h => h.getText()));
            expect(headersText).toEqual(['', 'URI', 'Full name', 'Email']);
            const trs = await driver.findElements(By.css('.contributed_resources table tbody tr'));
            expect(trs.length).toEqual(1);

            const tds = await driver.findElements(By.css('.contributed_resources table tbody td'));

            const tdsText = await Promise.all(tds.map(td => td.getText()));
            expect(tdsText.some(t => t === 'PEREGRIN.TOOK')).toEqual(true);
            expect(tdsText.some(t => t === 'peregrin.took@shire.net')).toEqual(true);
        });

        it('should filter the rejected contributed resources', async () => {
            const filter = await driver.findElement(By.css('.contributed_resources .filter'));
            await driver.wait(elementIsClicked(filter), DEFAULT_WAIT_TIMEOUT);

            await driver.wait(until.elementLocated(By.css('.filter_REJECTED')), DEFAULT_WAIT_TIMEOUT);
            const filterRejected = await driver.findElement(By.css('.filter_REJECTED'));
            await driver.wait(elementIsClicked(filterRejected), DEFAULT_WAIT_TIMEOUT);
        });

        it('should display the rejected contributed resources', async () => {
            await driver.wait(until.elementLocated(By.css('.contributed_resources')), DEFAULT_WAIT_TIMEOUT);
            const headers = await driver.findElements(By.css('.contributed_resources table th'));
            const headersText = await Promise.all(headers.map(h => h.getText()));
            expect(headersText).toEqual(['', 'URI', 'Full name', 'Email']);
            const trs = await driver.findElements(By.css('.contributed_resources table tbody tr'));
            expect(trs.length).toEqual(1);

            const tds = await driver.findElements(By.css('.contributed_resources table tbody td'));

            const tdsText = await Promise.all(tds.map(td => td.getText()));
            expect(tdsText.some(t => t === 'BILBON.BAGGINS')).toEqual(true);
            expect(tdsText.some(t => t === 'bilbon.saquet@shire.net')).toEqual(true);
        });

        it('should go to resource page when clicking on review', async () => {
            const reviewButton = await driver.findElement(By.css('.btn-review-resource'));
            await driver.wait(elementIsClicked(reviewButton), DEFAULT_WAIT_TIMEOUT);
            await driver.wait(until.elementLocated(By.css('.title')));
            const title = await driver.findElement(By.css('.title, h1'), DEFAULT_WAIT_TIMEOUT);
            driver.wait(until.elementTextIs(title, '3'), DEFAULT_WAIT_TIMEOUT);
        });

        after(async () => {
            await clear();
            await driver.executeScript('sessionStorage.clear();');
        });
    });
});
