import { until, By } from 'selenium-webdriver';
import expect from 'expect';
import path from 'path';

import driver from '../../../common/tests/chromeDriver';
import { elementIsClicked, elementsCountIs } from '../../../common/tests/conditions';
import { clear } from '../../../common/tests/fixtures';
import loginAsJulia from '../loginAsJulia';

describe('Admin', () => {
    describe('Import model', function homeTests() {
        this.timeout(30000);
        const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

        before(async () => {
            await clear();

            await driver.get('http://localhost:3100/admin');
            await driver.executeScript('return localStorage.clear();');
            await driver.executeScript('return sessionStorage.clear();');

            await loginAsJulia('/admin', '/');
        });

        describe('Uploading dataset', () => {
            it('should display the upload component if no dataset has been loaded yet', async () => {
                await driver.wait(until.elementLocated(By.css('.upload')), DEFAULT_WAIT_TIMEOUT);
            });

            it('should display the parsing result after uploading a csv', async () => {
                const csvPath = path.resolve(__dirname, './linked_sample_csv.CSV');
                const input = await driver.findElement(By.css('input[name=file]'));
                await input.sendKeys(csvPath);
                await driver.wait(until.elementLocated(By.css('.parsingResult')), DEFAULT_WAIT_TIMEOUT);
            });
        });

        describe('Uploading model', () => {
            let dialogImportFields;

            it('should allow uploading a model as json', async () => {
                await driver.wait(until.elementLocated(By.css('.btn-model-menu')), DEFAULT_WAIT_TIMEOUT);
                const buttonMenu = driver.findElement(By.css('.btn-model-menu'));
                await driver.wait(elementIsClicked(buttonMenu));
                await driver.sleep(500);

                await driver.wait(until.elementLocated(By.css('.btn-import-fields')), DEFAULT_WAIT_TIMEOUT);
                const button = driver.findElement(By.css('.btn-import-fields'));
                await driver.wait(elementIsClicked(button));

                await driver.wait(until.elementLocated(By.css('.dialog-import-fields')), DEFAULT_WAIT_TIMEOUT);
                dialogImportFields = driver.findElement(By.css('.dialog-import-fields'));

                const modelPath = path.resolve(__dirname, './linked_sample_model.json');
                const input = await driver.findElement(By.css('input[name=file_model]'));
                await input.sendKeys(modelPath);

                await driver.wait(until.stalenessOf(dialogImportFields), DEFAULT_WAIT_TIMEOUT);
                await driver.sleep(500); // For overlay

                await driver.wait(
                    elementsCountIs(By.css('.publication-preview tr th'), 5),
                    DEFAULT_WAIT_TIMEOUT,
                );
            });

            it('should have completed uri column with generated uri', async () => {
                await driver.wait(
                    elementsCountIs(By.css('.publication-preview tr td:first-child'), 5),
                    DEFAULT_WAIT_TIMEOUT,
                );

                const tds = await driver.findElements(By.css('.publication-preview tr td:first-child'));
                expect(tds.length).toBe(5);
                await Promise.all(tds.slice(0, 3).map(td => // last td is the remove button
                    driver.wait(until.elementTextMatches(td, /[A-Z0-9]{8}/), DEFAULT_WAIT_TIMEOUT)),
                );
            });

            it('should have added stronger column with link', async () => {
                const tds = await driver.findElements(By.css('.publication-preview tr td:nth-child(2)'));
                expect(tds.length).toBe(5);

                const expectedTexts = [
                    'uri to id: 3',
                    'uri to id: 1',
                    'uri to id: 2',
                    '',
                ];
                await Promise.all(tds.slice(0, 3).map((td, index) => // last td is the remove button
                    driver.wait(until.elementTextIs(td, expectedTexts[index]), DEFAULT_WAIT_TIMEOUT)),
                );
            });

            it('should have added the name column', async () => {
                const tds = await driver.findElements(By.css('.publication-preview tr td:nth-child(3)'));
                expect(tds.length).toBe(5);
                await Promise.all(tds.slice(0, 3).map(td => // last td is the remove button
                    driver.wait(
                        until.elementTextMatches(td, /rock|paper|scissor|invalid_reference/), DEFAULT_WAIT_TIMEOUT),
                    ),
                );
            });

            it('should have added the title custom column with value', async () => {
                const tds = await driver.findElements(By.css('.publication-preview tr td:nth-child(4)'));
                expect(tds.length).toBe(5);

                const expectedTexts = [
                    'Rock-Paper-Scissor',
                    'Rock-Paper-Scissor',
                    'Rock-Paper-Scissor',
                    'Rock-Paper-Scissor',
                ];
                await Promise.all(tds.slice(0, 3).map((td, index) => // last td is the remove button
                    driver.wait(until.elementTextIs(td, expectedTexts[index]), DEFAULT_WAIT_TIMEOUT)),
                );
            });

            it('should have added the genre custom column with value', async () => {
                await driver.wait(until.elementLocated(
                    By.css('.publication-preview th .completes_title'),
                ), DEFAULT_WAIT_TIMEOUT);
                const th = await driver.findElement(By.css('.publication-preview th:nth-child(5) .completes_title'));
                await driver.wait(until.elementTextIs(th, 'Completes Title'), DEFAULT_WAIT_TIMEOUT);

                const tds = await driver.findElements(By.css('.publication-preview tr td:nth-child(5)'));
                expect(tds.length).toBe(5);

                const expectedTexts = [
                    'Zero-sum hand game',
                    'Zero-sum hand game',
                    'Zero-sum hand game',
                    'Zero-sum hand game',
                ];
                await Promise.all(tds.slice(0, 3).map((td, index) => // last td is the remove button
                    driver.wait(until.elementTextIs(td, expectedTexts[index]), DEFAULT_WAIT_TIMEOUT)),
                );
            });
        });

        after(async () => {
            await clear();
            await driver.executeScript('localStorage.clear();');
            await driver.executeScript('sessionStorage.clear();');
        });
    });
});
