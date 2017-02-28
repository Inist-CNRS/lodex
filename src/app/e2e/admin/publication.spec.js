import { until, By } from 'selenium-webdriver';
import expect from 'expect';
import path from 'path';

import driver from '../../../common/tests/chromeDriver';
import { clear } from '../../../common/tests/fixtures';
import { elementIsClicked, inputElementIsFocusable, elementValueIs } from '../../../common/tests/conditions';
import loginAsJulia from '../loginAsJulia';

describe('Admin', () => {
    describe('Publication', function homeTests() {
        this.timeout(30000);
        const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

        before(async () => {
            await clear();
            await loginAsJulia('/admin', '/');
        });

        describe('Uploading', () => {
            it('should display the upload component if no dataset has been loaded yet', async () => {
                await driver.wait(until.elementLocated(By.css('.upload')), DEFAULT_WAIT_TIMEOUT);
            });

            it('should display the parsing result after uploading a csv', async () => {
                const csvPath = path.resolve(__dirname, './linked_sample_csv.csv');
                const input = await driver.findElement(By.css('input[name=file]'));
                await input.sendKeys(csvPath);
                await driver.wait(until.elementLocated(By.css('.parsingResult')), DEFAULT_WAIT_TIMEOUT);
            });
        });

        describe('configuring uri column', async () => {
            it('should display publication_preview', async () => {
                await driver.wait(until.elementLocated(By.css('.publication-preview')), DEFAULT_WAIT_TIMEOUT);
            });

            it('should display only uri empty column', async () => {
                const th = await driver.findElement(By.css('.publication-preview th'));
                driver.wait(until.elementTextIs(th, 'uri'), DEFAULT_WAIT_TIMEOUT);
                const tds = await driver.findElements(By.css('.publication-preview tr td:first-child'));
                expect(tds.length).toBe(5);
                await Promise.all(tds.slice(0, 3).map(td => // last td is the remove button
                    driver.wait(until.elementTextIs(td, ''), DEFAULT_WAIT_TIMEOUT)),
                );
            });

            it('should display form for uri column when clicking on uri column', async () => {
                await driver.findElement(By.css('.publication-preview th')).click();
                await driver.wait(until.elementLocated(By.css('#field_form')), DEFAULT_WAIT_TIMEOUT);
                const label = await driver.findElement(By.css('#field_form input[name=label]'));
                await driver.wait(elementValueIs(label, 'uri'), DEFAULT_WAIT_TIMEOUT);
            });

            it('should allow to add a transformer AUTOGENERATE_URI', async () => {
                await driver.findElement(By.css('#field_form .add-transformer')).click();

                await driver.findElement(By.css('.operation')).click();
                await driver.wait(until.elementLocated(By.css('.transformer_AUTOGENERATE_URI')));
                await driver.findElement(By.css('.transformer_AUTOGENERATE_URI')).click();
            });

            it('should have completed uri column with generated uri', async () => {
                const tds = await driver.findElements(By.css('.publication-preview tr td:first-child'));
                expect(tds.length).toBe(4);
                await Promise.all(tds.map(td =>
                    driver.wait(until.elementTextMatches(td, /[A-Z0-9]{8}/), DEFAULT_WAIT_TIMEOUT)),
                );

                const backButton = await driver.findElement(By.css('.btn-exit-column-edition'));
                await driver.wait(elementIsClicked(backButton), DEFAULT_WAIT_TIMEOUT);
            });
        });

        describe('adding LINK column', () => {
            it('should display form for newField2 column when clicking on btn-add-column', async () => {
                await driver.executeScript('document.getElementsByClassName("add-column")[0].scrollIntoView(true);');
                const button = await driver.findElement(By.css('.add-column'));
                await driver.wait(elementIsClicked(button), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(until.elementLocated(By.css('#field_form')), DEFAULT_WAIT_TIMEOUT);
                await driver.executeScript('document.getElementById("field_form").scrollIntoView(true);');
                const label = await driver.findElement(By.css('#field_form input[name=label]'));

                await driver.wait(elementValueIs(label, 'newField 2'), DEFAULT_WAIT_TIMEOUT);
            });

            it('should change column name', async () => {
                const label = await driver.findElement(By.css('#field_form input[name=label]'));
                await driver.wait(inputElementIsFocusable(label), DEFAULT_WAIT_TIMEOUT);

                await label.clear();
                await label.sendKeys('Stronger than');
                const th = await driver.findElement(By.css('.publication-preview th'));
                await driver.wait(until.elementTextIs(th, 'Stronger than'), DEFAULT_WAIT_TIMEOUT);
            });

            it('should add a transformer LINK', async () => {
                const addTransformerButton = await driver.findElement(By.css('#field_form .add-transformer'));
                await driver.wait(elementIsClicked(addTransformerButton), DEFAULT_WAIT_TIMEOUT);

                await driver.sleep(500); // wait for transformers to be loaded
                await driver.wait(until.elementLocated(By.css('.operation')), DEFAULT_WAIT_TIMEOUT);
                const operationButton = await driver.findElement(By.css('.operation'));
                await driver.wait(elementIsClicked(operationButton), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(until.elementLocated(By.css('.transformer_LINK')), DEFAULT_WAIT_TIMEOUT);
                const linkButton = await driver.findElement(By.css('.transformer_LINK'));
                await driver.wait(elementIsClicked(linkButton), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(until.elementLocated(By.css('#field_form .transformer_arg_reference input')), DEFAULT_WAIT_TIMEOUT);
            });

            it('should configure transformer Link', async () => {
                const reference = await driver.findElement(By.css('#field_form .transformer_arg_reference input'));
                await driver.wait(inputElementIsFocusable(reference), DEFAULT_WAIT_TIMEOUT);
                reference.sendKeys('stronger_than');

                const identifier = await driver.findElement(By.css('#field_form .transformer_arg_identifier input'));
                await driver.wait(inputElementIsFocusable(identifier), DEFAULT_WAIT_TIMEOUT);
                identifier.sendKeys('id');
                const backButton = await driver.findElement(By.css('.btn-exit-column-edition'));
                await driver.wait(elementIsClicked(backButton), DEFAULT_WAIT_TIMEOUT);
            });

            it('should have added stronger column with link', async () => {
                await driver.wait(
                    until.elementLocated(By.css('.publication-preview tr td:nth-child(2)')),
                    DEFAULT_WAIT_TIMEOUT,
                );
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
        });

        describe('adding column from original dataset', async () => {
            it('should add auto configured column when clicking add-column button for an original field', async () => {
                await driver.executeScript(
                    'document.getElementsByClassName("btn-excerpt-add-column-name")[0].scrollIntoView(true);',
                );
                const button = await driver.findElement(By.css('.btn-excerpt-add-column-name'));
                await driver.wait(elementIsClicked(button), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(until.elementLocated(By.css('.publication-excerpt-column-name')), DEFAULT_WAIT_TIMEOUT);
            });

            it('should have updated the preview', async () => {
                const tds = await driver.findElements(By.css('.publication-preview tr td:last-child'));
                expect(tds.length).toBe(4);
                await Promise.all(tds.map(td =>
                    driver.wait(
                        until.elementTextMatches(td, /rock|paper|scissor|invalid_reference/), DEFAULT_WAIT_TIMEOUT),
                    ),
                );
            });
        });

        describe('adding VALUE column', () => {
            it('should display form for newField4 column when clicking on btn-add-column', async () => {
                await driver.executeScript('document.getElementsByClassName("add-column")[0].scrollIntoView(true);');
                const button = await driver.findElement(By.css('.add-column'));
                await driver.wait(elementIsClicked(button), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(until.elementLocated(By.css('#field_form')), DEFAULT_WAIT_TIMEOUT);
                await driver.executeScript('document.getElementById("field_form").scrollIntoView(true);');
                const label = await driver.findElement(By.css('#field_form input[name=label]'));

                await driver.wait(elementValueIs(label, 'newField 4'), DEFAULT_WAIT_TIMEOUT);
            });

            it('should change column name', async () => {
                const label = await driver.findElement(By.css('#field_form input[name=label]'));
                await driver.wait(inputElementIsFocusable(label), DEFAULT_WAIT_TIMEOUT);

                await label.clear();
                await label.sendKeys('Title');
                const th = await driver.findElement(By.css('.publication-preview th'));
                await driver.wait(until.elementTextIs(th, 'Title'), DEFAULT_WAIT_TIMEOUT);
            });

            it('should add a transformer VALUE', async () => {
                const addTransformerButton = await driver.findElement(By.css('#field_form .add-transformer'));
                await driver.wait(elementIsClicked(addTransformerButton), DEFAULT_WAIT_TIMEOUT);

                await driver.sleep(500); // wait for transformers to be loaded
                await driver.wait(until.elementLocated(By.css('.operation')), DEFAULT_WAIT_TIMEOUT);
                const operationButton = await driver.findElement(By.css('.operation'));
                await driver.wait(elementIsClicked(operationButton), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(until.elementLocated(By.css('.transformer_VALUE')), DEFAULT_WAIT_TIMEOUT);
                const transformerButton = await driver.findElement(By.css('.transformer_VALUE'));
                await driver.wait(elementIsClicked(transformerButton), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(until.elementLocated(By.css('#field_form .transformer_arg_value input')), DEFAULT_WAIT_TIMEOUT);
            });

            it('should configure transformer VALUE', async () => {
                const value = await driver.findElement(By.css('#field_form .transformer_arg_value input'));
                await driver.wait(inputElementIsFocusable(value), DEFAULT_WAIT_TIMEOUT);
                value.sendKeys('Rock-Paper-Scissor');

                const backButton = await driver.findElement(By.css('.btn-exit-column-edition'));
                await driver.wait(elementIsClicked(backButton), DEFAULT_WAIT_TIMEOUT);
            });

            it('should have added custom column with value', async () => {
                await driver.wait(
                    until.elementLocated(By.css('.publication-preview tr td:nth-child(4)')),
                    DEFAULT_WAIT_TIMEOUT,
                );
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
        });

        describe('adding completes column', () => {
            it('should display form for newField5 column when clicking on btn-add-column', async () => {
                await driver.executeScript('document.getElementsByClassName("add-column")[0].scrollIntoView(true);');
                const button = await driver.findElement(By.css('.add-column'));
                await driver.wait(elementIsClicked(button), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(until.elementLocated(By.css('#field_form')), DEFAULT_WAIT_TIMEOUT);
                await driver.executeScript('document.getElementById("field_form").scrollIntoView(true);');
                const label = await driver.findElement(By.css('#field_form input[name=label]'));

                await driver.wait(elementValueIs(label, 'newField 5'), DEFAULT_WAIT_TIMEOUT);
            });

            it('should change column name', async () => {
                const label = await driver.findElement(By.css('#field_form input[name=label]'));
                await driver.wait(inputElementIsFocusable(label), DEFAULT_WAIT_TIMEOUT);

                await label.clear();
                await label.sendKeys('Genre');

                const th = await driver.findElement(By.css('.publication-preview th'));
                await driver.wait(until.elementTextIs(th, 'Genre'), DEFAULT_WAIT_TIMEOUT);
            });

            it('should add a transformer VALUE', async () => {
                const addTransformerButton = await driver.findElement(By.css('#field_form .add-transformer'));
                await driver.wait(elementIsClicked(addTransformerButton), DEFAULT_WAIT_TIMEOUT);

                await driver.sleep(500); // wait for transformers to be loaded
                await driver.wait(until.elementLocated(By.css('.operation')), DEFAULT_WAIT_TIMEOUT);
                const operationButton = await driver.findElement(By.css('.operation'));
                await driver.wait(elementIsClicked(operationButton), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(until.elementLocated(By.css('.transformer_VALUE')), DEFAULT_WAIT_TIMEOUT);
                const transformerButton = await driver.findElement(By.css('.transformer_VALUE'));
                await driver.wait(elementIsClicked(transformerButton), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(until.elementLocated(By.css('#field_form .transformer_arg_value input'), DEFAULT_WAIT_TIMEOUT));
            });

            it('should configure transformer VALUE', async () => {
                const value = await driver.findElement(By.css('#field_form .transformer_arg_value input'));
                await driver.wait(inputElementIsFocusable(value), DEFAULT_WAIT_TIMEOUT);
                value.sendKeys('Zero-sum hand game');
            });

            it('should configure completes', async () => {
                await driver.wait(until.elementLocated(By.css('#field_form .completes')), DEFAULT_WAIT_TIMEOUT);
                const completes = await driver.findElement(By.css('#field_form .completes'));
                await driver.wait(elementIsClicked(completes), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(until.elementLocated(By.css('.completes_title')), DEFAULT_WAIT_TIMEOUT);
                const completesTitleButton = await driver.findElement(By.css('.completes_title'));
                await driver.wait(elementIsClicked(completesTitleButton), DEFAULT_WAIT_TIMEOUT);

                const th = await driver.findElement(By.css('.publication-preview th .completes_title'));
                await driver.wait(until.elementTextIs(th, 'Completes Title'), DEFAULT_WAIT_TIMEOUT);

                const backButton = await driver.findElement(By.css('.btn-exit-column-edition'));
                await driver.wait(elementIsClicked(backButton), DEFAULT_WAIT_TIMEOUT);
            });

            it('should have added custom column with value', async () => {
                await driver.wait(
                    until.elementLocated(By.css('.publication-preview tr td:last-child')),
                    DEFAULT_WAIT_TIMEOUT,
                );
                const tds = await driver.findElements(By.css('.publication-preview tr td:last-child'));
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

        describe('removing column', async () => {
            it('should add auto configured column when clicking add-column button for an original field', async () => {
                await driver.executeScript(
                    'document.getElementsByClassName("btn-excerpt-add-column-name")[0].scrollIntoView(true);',
                );
                const button = await driver.findElement(By.css('.btn-excerpt-add-column-name'));
                await driver.wait(elementIsClicked(button), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(until.elementLocated(By.css('.publication-excerpt-column-name')), DEFAULT_WAIT_TIMEOUT);
            });

            it('should have updated the preview', async () => {
                const tds = await driver.findElements(By.css('.publication-preview tr td:last-child'));
                expect(tds.length).toBe(4);
                await Promise.all(tds.map(td =>
                    driver.wait(
                        until.elementTextMatches(td, /rock|paper|scissor|invalid_reference/), DEFAULT_WAIT_TIMEOUT),
                    ),
                );
            });

            it('should remove column when clicking btn-remove-column button for a field', async () => {
                const button = await driver.findElement(By.css('.btn-remove-column'));
                await driver.wait(elementIsClicked(button), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(until.stalenessOf(button), DEFAULT_WAIT_TIMEOUT);
            });

            it('should have updated the preview', async () => {
                await driver.wait(
                    until.elementLocated(By.css('.publication-preview tr td:last-child')),
                    DEFAULT_WAIT_TIMEOUT,
                );
                const tds = await driver.findElements(By.css('.publication-preview tr td:last-child'));
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

        describe('Publishing', () => {
            it('should display the "data published" message after publication', async () => {
                const buttonPublish = await driver.findElement(By.css('.btn-publish'));
                await driver.wait(elementIsClicked(buttonPublish), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(until.elementLocated(By.css('.data-published')), DEFAULT_WAIT_TIMEOUT);
            });

            it('should not display the parsing result after publication', async () => {
                const parsingResult = await driver.findElements(By.css('.parsingResult'));
                expect(parsingResult.length).toEqual(0);
            });

            it('should not display the upload after publication', async () => {
                const upload = await driver.findElements(By.css('.upload'));
                expect(upload.length).toEqual(0);
            });

            it('should display the published data on the home page', async () => {
                await driver.get('http://localhost:3010/');
                await driver.wait(until.elementLocated(By.css('.dataset')), DEFAULT_WAIT_TIMEOUT);
                const headers = await driver.findElements(By.css('.dataset table th'));
                const headersText = await Promise.all(headers.map(h => h.getText()));
                expect(headersText).toEqual(['uri', 'Stronger than', 'name', 'Title', 'Genre']);
                const rows = await Promise.all([1, 2, 3, 4].map(index =>
                    Promise.all([
                        driver
                            .findElement(By.css(`.dataset table tbody tr:nth-child(${index}) td.dataset-uri`))
                            .getText(),
                        driver
                            .findElement(By.css(`.dataset table tbody tr:nth-child(${index}) td.dataset-stronger_than`))
                            .getText(),
                        driver
                            .findElement(By.css(`.dataset table tbody tr:nth-child(${index}) td.dataset-name`))
                            .getText(),
                        driver
                            .findElement(By.css(`.dataset table tbody tr:nth-child(${index}) td.dataset-title`))
                            .getText(),
                        driver
                            .findElement(By.css(`.dataset table tbody tr:nth-child(${index}) td.dataset-genre`))
                            .getText(),
                    ])
                    .then(([uri, stronger, name, title, genre]) => ({
                        uri,
                        stronger,
                        name,
                        title,
                        genre,
                    }))));

                const expected = {
                    rock: 'scissor',
                    paper: 'rock',
                    scissor: 'paper',
                    invalid_reference: '',
                };

                rows.forEach(({ stronger, name, title, genre }) => {
                    expect((rows.find(r => r.uri === stronger) || { name: '' }).name).toEqual(expected[name]);
                    expect(title).toEqual('Rock-Paper-Scissor');
                    expect(genre).toEqual('Zero-sum hand game');
                });
            });
        });

        after(async () => {
            await driver.executeScript('localStorage.clear();');
            await clear();
        });
    });
});
