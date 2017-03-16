import { until, By } from 'selenium-webdriver';
import expect from 'expect';
import { elementIsClicked, elementTextIs } from 'selenium-smart-wait';

import driver from '../../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../../common/tests/fixtures';
import fixtures from './contributedResources.json';
import loginAsJulia from '../loginAsJulia';

describe('Admin', () => {
    describe('Contributed Resource management', function homePublishedDataTests() {
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
            const filter = '.contributed_resources .filter';
            await driver.wait(elementIsClicked(filter), DEFAULT_WAIT_TIMEOUT);
            await driver.sleep(500); // animations

            await driver.wait(until.elementLocated(By.css('.filter_VALIDATED')), DEFAULT_WAIT_TIMEOUT);

            const filterValidated = '.filter_VALIDATED';
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
            const filter = '.contributed_resources .filter';
            await driver.wait(elementIsClicked(filter), DEFAULT_WAIT_TIMEOUT);
            await driver.sleep(500); // animations

            await driver.wait(until.elementLocated(By.css('.filter_REJECTED')), DEFAULT_WAIT_TIMEOUT);

            const filterRejected = '.filter_REJECTED';
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
            const reviewButton = '.btn-review-resource';
            await driver.wait(elementIsClicked(reviewButton), DEFAULT_WAIT_TIMEOUT);
            await driver.wait(until.elementLocated(By.css('.title')));
            const title = '.title, h1';
            driver.wait(elementTextIs(title, '3'), DEFAULT_WAIT_TIMEOUT);
        });

        it('should display note striked out with a moderate butoon on REJECTED', async () => {
            await driver.wait(until.elementLocated(By.css('.property.note')));
            const noteProperty = await driver.findElement(By.css('.property.note'));
            const notePropertyLabel = await driver.findElement(By.css('.property.note .property_label'));
            expect(await notePropertyLabel.getCssValue('text-decoration')).toContain('line-through');
            const contributor = await noteProperty.findElement(By.css('.property_contributor'));
            expect(await contributor.getText()).toBe('Added by john');
            const moderateButton = await noteProperty.findElement(By.css('.moderate'));
            const rejectButton = await moderateButton.findElement(By.css('.REJECTED'));
            expect(await rejectButton.getAttribute('class'))
                .toBe('REJECTED active');
            const validateButton = await moderateButton.findElement(By.css('.VALIDATED'));
            expect(await validateButton.getAttribute('class'))
                .toBe('VALIDATED');
            const proposeButton = await moderateButton.findElement(By.css('.PROPOSED'));
            expect(await proposeButton.getAttribute('class'))
                .toBe('PROPOSED');
        });

        it('should change note to proposed', async () => {
            await driver.wait(until.elementLocated(By.css('.property.note')));

            const proposeButton = '.property.note .moderate .PROPOSED';
            await driver.wait(elementIsClicked(proposeButton), DEFAULT_WAIT_TIMEOUT);
        });

        it('should display note with a moderate button on PROPOSED', async () => {
            await driver.wait(until.elementLocated(By.css('.property.note')));
            const noteProperty = await driver.findElement(By.css('.property.note'));
            const notePropertyLabel = await driver.findElement(By.css('.property.note .property_label'));
            expect(await notePropertyLabel.getCssValue('text-decoration')).toContain('none');
            const contributor = await noteProperty.findElement(By.css('.property_contributor'));
            expect(await contributor.getText()).toBe('Contributed by john');
            const moderateButton = await noteProperty.findElement(By.css('.moderate'));
            const rejectButton = await moderateButton.findElement(By.css('.REJECTED'));
            expect(await rejectButton.getAttribute('class'))
                .toBe('REJECTED');
            const validateButton = await moderateButton.findElement(By.css('.VALIDATED'));
            expect(await validateButton.getAttribute('class'))
                .toBe('VALIDATED');
            const proposeButton = await moderateButton.findElement(By.css('.PROPOSED'));
            expect(await proposeButton.getAttribute('class'))
                .toBe('PROPOSED active');
        });

        it('should change note to validated', async () => {
            await driver.wait(until.elementLocated(By.css('.property.note')));
            const validatedButton = '.property.note .moderate .VALIDATED';
            await driver.wait(elementIsClicked(validatedButton), DEFAULT_WAIT_TIMEOUT);
        });

        it('should display note with a moderate button on VALIDATED', async () => {
            await driver.wait(until.elementLocated(By.css('.property.note')));
            const noteProperty = await driver.findElement(By.css('.property.note'));
            const notePropertyLabel = await driver.findElement(By.css('.property.note .property_label'));

            expect(await notePropertyLabel.getCssValue('text-decoration')).toContain('none');
            const contributor = await noteProperty.findElement(By.css('.property_contributor'));
            expect(await contributor.getText()).toBe('Added by john');
            const moderateButton = await noteProperty.findElement(By.css('.moderate'));
            const rejectButton = await moderateButton.findElement(By.css('.REJECTED'));
            expect(await rejectButton.getAttribute('class'))
                .toBe('REJECTED');
            const validateButton = await moderateButton.findElement(By.css('.VALIDATED'));
            expect(await validateButton.getAttribute('class'))
                .toBe('VALIDATED active');
            const proposeButton = await moderateButton.findElement(By.css('.PROPOSED'));
            expect(await proposeButton.getAttribute('class'))
                .toBe('PROPOSED');
        });

        after(async () => {
            await clear();
            await driver.executeScript('localStorage.clear();');
            await driver.executeScript('sessionStorage.clear();');
        });
    });
});
