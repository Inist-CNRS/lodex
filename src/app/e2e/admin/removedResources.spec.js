import { until, By } from 'selenium-webdriver';
import expect from 'expect';
import { elementIsClicked } from 'selenium-smart-wait';

import driver from '../../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../../common/tests/fixtures';
import fixtures from './removedResources.json';
import loginAsJulia from './loginAsJulia';

describe('Admin', () => {
    describe('Removed Resource management', function homePublishedDataTests() {
        this.timeout(30000);
        const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

        before(async () => {
            await clear(); // Had to ensure clear state for unknown reason
            await loadFixtures(fixtures);

            await driver.get('http://localhost:3100/admin');
            await driver.executeScript('return localStorage.clear();');
            await driver.executeScript('return sessionStorage.clear();');

            await loginAsJulia('/admin');
        });

        it('should activate removed-resources tab', async () => {
            await driver.wait(until.elementLocated(By.css('.removed-tab')), DEFAULT_WAIT_TIMEOUT);
            const tab = '.removed-tab';
            await driver.wait(elementIsClicked(tab), DEFAULT_WAIT_TIMEOUT);
        });

        it('should display the removed resources', async () => {
            await driver.wait(until.elementLocated(By.css('.removed_resources')), DEFAULT_WAIT_TIMEOUT);
            const headers = await driver.findElements(By.css('.removed_resources table th'));
            const headersText = await Promise.all(headers.map(h => h.getText()));
            expect(headersText).toEqual(['Removed at', 'Reason', 'URI', 'Full name', 'Email', '']);

            const trs = await driver.findElements(By.css('.removed_resources table tbody tr'));
            expect(trs.length).toEqual(2);

            const tds = await driver.findElements(By.css('.removed_resources table tbody td'));

            const tdsText = await Promise.all(tds.map(td => td.getText()));
            expect(tdsText.some(t => t === 'PEREGRIN.TOOK')).toEqual(true);
            expect(tdsText.some(t => t === 'peregrin.took@shire.net')).toEqual(true);
            expect(tdsText.some(t => t === 'SAMSAGET.GAMGIE')).toEqual(true);
            expect(tdsText.some(t => t === 'samsaget.gamgie@shire.net')).toEqual(true);
        });

        it('should remove a resource which has been restored', async () => {
            const buttons = await driver.findElements(By.css('.btn-restore-resource'));
            await driver.wait(elementIsClicked(buttons[0]), DEFAULT_WAIT_TIMEOUT);

            await driver.sleep(500);
            const trs = await driver.findElements(By.css('.removed_resources table tbody tr'));
            expect(trs.length).toEqual(1);
        });

        after(async () => {
            await clear();
            await driver.executeScript('localStorage.clear();');
            await driver.executeScript('sessionStorage.clear();');
        });
    });
});
