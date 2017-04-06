import { until, By } from 'selenium-webdriver';
import expect from 'expect';

import {
    elementIsClicked,
    stalenessOf,
} from 'selenium-smart-wait';

import driver from '../../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../../common/tests/fixtures';
import loginAsJulia from './loginAsJulia';
import fixtures from './duplicatedUriPublication.json';
import waitForPreviewComputing from './waitForPreviewComputing';

describe('Admin', () => {
    describe('Publication with duplicated uri', function homeTests() {
        this.timeout(30000);
        const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

        describe('with duplicatedUri', () => {
            before(async () => {
                await clear();
                await loadFixtures(fixtures);

                await driver.get('http://localhost:3100/admin');
                await driver.executeScript('return localStorage.clear();');
                await driver.executeScript('return sessionStorage.clear();');
                await loginAsJulia('/admin');
            });

            it('should try to publish', async () => {
                const buttonPublish = '.btn-publish';
                await driver.wait(elementIsClicked(buttonPublish), DEFAULT_WAIT_TIMEOUT);
            });

            it('should display the confirmation modal', async () => {
                await driver.wait(until.elementLocated(By.css('#confirm-publication')), DEFAULT_WAIT_TIMEOUT);
                const msg = await driver.findElement(By.css('#confirm-publication p'));
                expect(await msg.getText()).toBe('1 documents have duplicated uri and will not be published');
            });

            it('should confirm', async () => {
                await driver.wait(elementIsClicked('.confirm', DEFAULT_WAIT_TIMEOUT));
                await driver.wait(until.elementLocated(By.css('.data-published')), DEFAULT_WAIT_TIMEOUT);
            });

            it('should display the published data on the home page', async () => {
                await driver.get('http://localhost:3100/');
                await driver.wait(until.elementLocated(By.css('.dataset')), DEFAULT_WAIT_TIMEOUT);
                const headers = await driver.findElements(By.css('.dataset table th'));
                const headersText = await Promise.all(headers.map(h => h.getText()));
                expect(headersText).toEqual(['URI', 'NAME', 'FIRSTNAME']);
                const rows = await Promise.all([1, 2, 3, 4].map(index =>
                    Promise.all([
                        driver
                            .findElement(By.css(`.dataset table tbody tr:nth-child(${index}) td.dataset-uri`))
                            .getText(),
                        driver
                            .findElement(By.css(`.dataset table tbody tr:nth-child(${index}) td.dataset-name`))
                            .getText(),
                        driver
                            .findElement(By.css(`.dataset table tbody tr:nth-child(${index}) td.dataset-firstname`))
                            .getText(),
                    ])
                    .then(([uri, name, firstname]) => ({
                        uri,
                        name,
                        firstname,
                    }))));
                expect(rows).toEqual([
                    { uri: 'uid:/BRANDYBUCK', name: 'BRANDYBUCK', firstname: 'MERIADOC' },
                    { uri: 'uid:/BAGGINS', name: 'BAGGINS', firstname: 'BILBON' },
                    { uri: 'uid:/GAMGIE', name: 'GAMGIE', firstname: 'SAMSAGET' },
                    { uri: 'uid:/TOOK', name: 'TOOK', firstname: 'PEREGRIN' },
                ]);
            });

            after(async () => {
                await driver.executeScript('localStorage.clear();');
                await driver.executeScript('sessionStorage.clear();');
                await clear();
            });
        });

        describe('deduplicating uri', () => {
            before(async () => {
                await clear();
                await loadFixtures(fixtures);

                await driver.get('http://localhost:3100/admin');
                await driver.executeScript('return localStorage.clear();');
                await driver.executeScript('return sessionStorage.clear();');
                await loginAsJulia('/admin');
            });

            it('should try to publish', async () => {
                const buttonPublish = '.btn-publish';
                await driver.wait(elementIsClicked(buttonPublish), DEFAULT_WAIT_TIMEOUT);
            });

            it('should display the confirmation modal', async () => {
                await driver.wait(until.elementLocated(By.css('#confirm-publication')), DEFAULT_WAIT_TIMEOUT);
                const msg = await driver.findElement(By.css('#confirm-publication p'));
                expect(await msg.getText()).toBe('1 documents have duplicated uri and will not be published');
            });

            it('should cancel', async () => {
                await driver.wait(elementIsClicked('.cancel', DEFAULT_WAIT_TIMEOUT));
            });

            let fieldForm;

            it('should display form for uri column when clicking on uri column', async () => {
                await driver.wait(elementIsClicked('.publication-excerpt-column-uri', DEFAULT_WAIT_TIMEOUT));
                await driver.wait(until.elementLocated(By.css('#field_form')), DEFAULT_WAIT_TIMEOUT);
                fieldForm = await driver.findElement(By.css('#field_form'));
            });

            it('should allow to add a transformer CONCAT_URI', async () => {
                await driver.wait(until.elementLocated(By.css('.radio_concat')), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(elementIsClicked('.radio_concat'), DEFAULT_WAIT_TIMEOUT);
                await driver.findElement(By.css('#separator')).sendKeys('-');
                await driver.wait(elementIsClicked('#select-column-0'), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(elementIsClicked('.column-name'), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(elementIsClicked('#select-column-1'), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(elementIsClicked('.column-firstname'), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(elementIsClicked('.btn-save'), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(stalenessOf(fieldForm, DEFAULT_WAIT_TIMEOUT));

                await waitForPreviewComputing();
            });

            it('should publish', async () => {
                const buttonPublish = '.btn-publish';
                await driver.wait(elementIsClicked(buttonPublish), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(until.elementLocated(By.css('.data-published')), DEFAULT_WAIT_TIMEOUT);
            });

            it('should display the published data on the home page', async () => {
                await driver.get('http://localhost:3100/');
                await driver.wait(until.elementLocated(By.css('.dataset')), DEFAULT_WAIT_TIMEOUT);
                const headers = await driver.findElements(By.css('.dataset table th'));
                const headersText = await Promise.all(headers.map(h => h.getText()));
                expect(headersText).toEqual(['URI', 'NAME', 'FIRSTNAME']);
                const rows = await Promise.all([1, 2, 3, 4, 5].map(index =>
                    Promise.all([
                        driver
                            .findElement(By.css(`.dataset table tbody tr:nth-child(${index}) td.dataset-uri`))
                            .getText(),
                        driver
                            .findElement(By.css(`.dataset table tbody tr:nth-child(${index}) td.dataset-name`))
                            .getText(),
                        driver
                            .findElement(By.css(`.dataset table tbody tr:nth-child(${index}) td.dataset-firstname`))
                            .getText(),
                    ])
                    .then(([uri, name, firstname]) => ({
                        uri,
                        name,
                        firstname,
                    }))));
                expect(rows).toEqual([
                    { uri: 'uid:/BRANDYBUCK-MERIADOC', name: 'BRANDYBUCK', firstname: 'MERIADOC' },
                    { uri: 'uid:/BAGGINS-FRODO', name: 'BAGGINS', firstname: 'FRODO' },
                    { uri: 'uid:/BAGGINS-BILBON', name: 'BAGGINS', firstname: 'BILBON' },
                    { uri: 'uid:/GAMGIE-SAMSAGET', name: 'GAMGIE', firstname: 'SAMSAGET' },
                    { uri: 'uid:/TOOK-PEREGRIN', name: 'TOOK', firstname: 'PEREGRIN' },
                ]);
            });
        });

        after(async () => {
            await driver.executeScript('localStorage.clear();');
            await driver.executeScript('sessionStorage.clear();');
            await clear();
        });
    });
});
