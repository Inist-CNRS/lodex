import { until, By } from 'selenium-webdriver';
import expect from 'expect';
import path from 'path';
import {
    elementIsClicked,
    stalenessOf,
    elementValueIs,
    elementTextIs,
    elementsCountIs,
    elementTextMatches,
} from 'selenium-smart-wait';

import driver from '../../../common/tests/chromeDriver';
import { clear } from '../../../common/tests/fixtures';
import { inputElementIsFocusable } from '../../../common/tests/conditions';
import loginAsJulia from './loginAsJulia';
import waitForPreviewComputing from './waitForPreviewComputing';
import navigate from '../navigate';
import goToDetails from '../goToDetails';

const factor = 3;

describe('Admin', () => {
    describe('Publication', function homeTests() {
        this.timeout(100000 * factor);
        const DEFAULT_WAIT_TIMEOUT = (19000 * factor); // A bit less than mocha's timeout
                                                       // to get explicit errors from selenium

        before(async () => {
            await clear();

            await loginAsJulia('/admin');
        });

        describe('Uploading', () => {
            it('should display the upload component if no dataset has been loaded yet', async () => {
                await driver.wait(until.elementLocated(By.css('.upload')), DEFAULT_WAIT_TIMEOUT);
            });

            it('should open upload modal', async () => {
                await driver.wait(elementIsClicked('.open-upload'));
            });

            it('should display the parsing result after uploading a csv', async () => {
                const csvPath = path.resolve(__dirname, './linked_sample_csv.CSV');
                const input = await driver.findElement(By.css('input[name=file]'));
                await input.sendKeys(csvPath);
                await driver.wait(until.elementLocated(By.css('.parsingResult')), DEFAULT_WAIT_TIMEOUT);
            });
        });

        describe('configuring uri column', async () => {
            let fieldForm;
            it('should display publication_preview', async () => {
                await driver.wait(until.elementLocated(By.css('.publication-preview')), DEFAULT_WAIT_TIMEOUT);
            });

            it('should display only uri empty column', async () => {
                const th = '.publication-preview th';
                await driver.wait(elementTextIs(th, 'uri', DEFAULT_WAIT_TIMEOUT));
                const tds = await driver.findElements(By.css('.publication-preview tr td:first-child'));
                await driver.wait(elementsCountIs(tds, 5), DEFAULT_WAIT_TIMEOUT);
                await Promise.all(tds.slice(0, 3).map(td => // last td is the remove button
                    driver.wait(elementTextIs(td, '', DEFAULT_WAIT_TIMEOUT))),
                );
            });

            it('should display form for uri column when clicking on uri column', async () => {
                await driver.findElement(By.css('.publication-preview th')).click();
                await driver.wait(until.elementLocated(By.css('#field_form')), DEFAULT_WAIT_TIMEOUT);
                fieldForm = await driver.findElement(By.css('#field_form'));
            });

            it('should allow to add a transformer AUTOGENERATE_URI', async () => {
                await driver.wait(until.elementLocated(By.css('.radio_generate')), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(elementIsClicked('.radio_generate'), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(elementIsClicked('.btn-save'), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(stalenessOf(fieldForm, DEFAULT_WAIT_TIMEOUT));
            });

            it('should have completed uri column with generated uri', async () => {
                await waitForPreviewComputing();

                for (let index = 1; index < 5; index += 1) {
                    await driver.wait( // eslint-disable-line
                        elementTextMatches(
                            `.publication-preview tr:nth-child(${index}) td:first-child`,
                            /[A-Z0-9]{8}/,
                            DEFAULT_WAIT_TIMEOUT,
                        ),
                    );
                }
            });
        });

        describe('adding LINK column', () => {
            let fieldForm;
            it('should display form for newField2 column when clicking on btn-add-column', async () => {
                const buttonAddColumn = '.btn-add-column';
                await driver.wait(elementIsClicked(buttonAddColumn), DEFAULT_WAIT_TIMEOUT);
                await driver.sleep(500); // animations

                const buttonAddFreeColumn = '.btn-add-free-column';
                await driver.wait(elementIsClicked(buttonAddFreeColumn), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(until.elementLocated(By.css('#field_form')), DEFAULT_WAIT_TIMEOUT);
                fieldForm = await driver.findElement(By.css('#field_form'));
                const label = '#field_form input[name=label]';

                await driver.wait(elementValueIs(label, 'newField 2'), DEFAULT_WAIT_TIMEOUT);
            });

            it('should change column name', async () => {
                const label = await driver.findElement(By.css('#field_form input[name=label]'));
                await driver.wait(inputElementIsFocusable(label), DEFAULT_WAIT_TIMEOUT);

                await label.clear();
                await label.sendKeys('Stronger than');

                const th = '.publication-excerpt-for-edition th';
                await driver.wait(elementTextIs(th, 'Stronger than', DEFAULT_WAIT_TIMEOUT));
                await driver.wait(elementIsClicked('.btn-next'), DEFAULT_WAIT_TIMEOUT);
                await driver.sleep(500); // animations
            });

            it('should add a transformer LINK', async () => {
                const button = '.radio_link';
                await driver.wait(until.elementLocated(By.css(button)), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(elementIsClicked(button), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(until.elementLocated(By.css('#select_ref_column')), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(until.elementLocated(By.css('#select_id_column')), DEFAULT_WAIT_TIMEOUT);
            });

            it('should configure transformer Link', async () => {
                await driver.wait(elementIsClicked('#select_id_column'), DEFAULT_WAIT_TIMEOUT);
                await driver.sleep(500); // animations
                await driver.wait(until.elementLocated(By.css('.column-stronger_than')), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(elementIsClicked('.column-stronger_than'), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(elementIsClicked('#select_ref_column'), DEFAULT_WAIT_TIMEOUT);
                await driver.sleep(500); // animations
                await driver.wait(until.elementLocated(By.css('.column-id')), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(elementIsClicked('.column-id'), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(elementIsClicked('.btn-save'), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(stalenessOf(fieldForm, DEFAULT_WAIT_TIMEOUT));
            });

            it('should have added stronger column with link', async () => {
                await waitForPreviewComputing();

                const expectedTexts = [
                    'text()="uri to id: 3"',
                    'text()="uri to id: 1"',
                    'text()="uri to id: 2"',
                    'not(text())',
                ];

                await Promise.all(
                    Array.from(Array(4).keys()).map((index) => {
                        const xpath = `//tr[position()=${index + 1}]//td[@class='publication-preview-column stronger_than' and ${expectedTexts[index]}]`;

                        return driver.wait(
                            until.elementLocated(
                                By.xpath(xpath),
                            ),
                            DEFAULT_WAIT_TIMEOUT,
                        );
                    }),
                );
            });
        });

        describe('adding column from original dataset', async () => {
            let fieldForm;
            it('should add auto configured column when clicking add-column button for an original field', async () => {
                const buttonAddColumn = '.btn-add-column';
                await driver.wait(elementIsClicked(buttonAddColumn), DEFAULT_WAIT_TIMEOUT);
                await driver.sleep(500); // animations

                const buttonAddColumnFromDataset = '.btn-add-column-from-dataset';
                await driver.wait(until.elementLocated(By.css(buttonAddColumnFromDataset)));
                await driver.wait(elementIsClicked(buttonAddColumnFromDataset), DEFAULT_WAIT_TIMEOUT);
                await driver.sleep(1000); // animations

                const buttonAddExcerptColumn = '.btn-excerpt-add-column-name';
                await driver.wait(until.elementLocated(By.css(buttonAddExcerptColumn)));
                await driver.wait(elementIsClicked(buttonAddExcerptColumn), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(until.elementLocated(By.css('#field_form')), DEFAULT_WAIT_TIMEOUT);
                fieldForm = await driver.findElement(By.css('#field_form'));

                const saveButton = '.btn-save';
                await driver.wait(elementIsClicked(saveButton), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(stalenessOf(fieldForm, DEFAULT_WAIT_TIMEOUT));
            });

            it('should have updated the preview', async () => {
                await waitForPreviewComputing();
                await driver.wait(until.elementLocated(By.css('.publication-preview')), DEFAULT_WAIT_TIMEOUT);

                const expectedTexts = [
                    'text()="rock"',
                    'text()="paper"',
                    'text()="scissor"',
                    'text()="invalid_reference"',
                ];

                await Promise.all(
                    Array.from(Array(4).keys()).map(index =>
                        driver.wait(
                            until.elementLocated(
                                By.xpath(`//tr[position()=${index + 1}]//td[@class='publication-preview-column name' and ${expectedTexts[index]}]`),
                            ),
                            DEFAULT_WAIT_TIMEOUT,
                        ),
                    ),
                );
            });
        });

        describe('adding VALUE column', () => {
            let fieldForm;

            it('should display form for newField4 column when clicking on btn-add-column', async () => {
                const buttonAddColumn = '.btn-add-column';
                await driver.wait(elementIsClicked(buttonAddColumn), DEFAULT_WAIT_TIMEOUT);
                await driver.sleep(500); // animations

                const buttonAddFreeColumn = '.btn-add-free-column';
                await driver.wait(elementIsClicked(buttonAddFreeColumn), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(until.elementLocated(By.css('#field_form')), DEFAULT_WAIT_TIMEOUT);
                fieldForm = await driver.findElement(By.css('#field_form'));

                const label = '#field_form input[name=label]';
                await driver.wait(elementValueIs(label, 'newField 4'), DEFAULT_WAIT_TIMEOUT);
            });

            it('should change column name', async () => {
                const label = await driver.findElement(By.css('#field_form input[name=label]'));
                await driver.wait(inputElementIsFocusable(label), DEFAULT_WAIT_TIMEOUT);

                await label.clear();
                await label.sendKeys('Title');
                const th = '.publication-excerpt-for-edition th';
                await driver.wait(elementTextIs(th, 'Title', DEFAULT_WAIT_TIMEOUT));
                await driver.wait(elementIsClicked('.btn-next'), DEFAULT_WAIT_TIMEOUT);
                await driver.sleep(500); // animations
            });

            it('should add a transformer VALUE', async () => {
                const button = '.radio_value';
                await driver.wait(until.elementLocated(By.css(button)), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(elementIsClicked(button), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(until.elementLocated(
                    By.css('#textbox_value'),
                ), DEFAULT_WAIT_TIMEOUT);
            });

            it('should configure transformer VALUE', async () => {
                const value = await driver.findElement(By.css('#textbox_value'));
                await driver.wait(inputElementIsFocusable(value), DEFAULT_WAIT_TIMEOUT);
                value.sendKeys('Rock-Paper-Scissor');

                const saveButton = await driver.findElement(By.css('.btn-save'));
                await driver.wait(elementIsClicked(saveButton), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(stalenessOf(fieldForm, DEFAULT_WAIT_TIMEOUT));
            });

            it('should have added custom column with value', async () => {
                await waitForPreviewComputing();
                await Promise.all(
                    Array.from(Array(4).keys()).map(index =>
                        driver.wait(
                            until.elementLocated(
                                By.xpath(`//tr[position()=${index + 1}]//td[@class='publication-preview-column title' and text()='Rock-Paper-Scissor']`),
                            ),
                            DEFAULT_WAIT_TIMEOUT,
                        ),
                    ),
                );
            });
        });

        describe('adding completes column', () => {
            let fieldForm;

            it('should display form for newField5 column when clicking on btn-add-column', async () => {
                const buttonAddColumn = '.btn-add-column';
                await driver.wait(elementIsClicked(buttonAddColumn), DEFAULT_WAIT_TIMEOUT);
                await driver.sleep(500); // animations

                const buttonAddFreeColumn = '.btn-add-free-column';
                await driver.wait(elementIsClicked(buttonAddFreeColumn), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(until.elementLocated(By.css('#field_form')), DEFAULT_WAIT_TIMEOUT);
                fieldForm = await driver.findElement(By.css('#field_form'));

                const label = '#field_form input[name=label]';
                await driver.wait(elementValueIs(label, 'newField 5'), DEFAULT_WAIT_TIMEOUT);
            });

            it('should change column name', async () => {
                const label = await driver.findElement(By.css('#field_form input[name=label]'));
                await driver.wait(inputElementIsFocusable(label), DEFAULT_WAIT_TIMEOUT);

                await label.clear();
                await label.sendKeys('Genre');

                const th = '.publication-excerpt-for-edition th';
                await driver.wait(elementTextIs(th, 'Genre', DEFAULT_WAIT_TIMEOUT));
                await driver.wait(elementIsClicked('.btn-next'), DEFAULT_WAIT_TIMEOUT);
                await driver.sleep(500); // animations
            });

            it('should add a transformer VALUE', async () => {
                const button = '.radio_value';
                await driver.wait(until.elementLocated(By.css(button)), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(elementIsClicked(button), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(until.elementLocated(
                    By.css('#textbox_value'),
                ), DEFAULT_WAIT_TIMEOUT);
            });

            it('should configure transformer VALUE', async () => {
                const value = await driver.findElement(By.css('#textbox_value'));
                await driver.wait(inputElementIsFocusable(value), DEFAULT_WAIT_TIMEOUT);
                value.sendKeys('Zero-sum hand game');

                await driver.wait(elementIsClicked('.btn-next'), DEFAULT_WAIT_TIMEOUT);
                await driver.sleep(500); // animations
                await driver.wait(elementIsClicked('.btn-next'), DEFAULT_WAIT_TIMEOUT);
                await driver.sleep(500); // animations
            });

            it('should configure completes', async () => {
                const completes = '#field_form .completes';
                await driver.wait(until.elementLocated(By.css(completes)), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(elementIsClicked(completes), DEFAULT_WAIT_TIMEOUT);
                await driver.sleep(1000); // animations

                const completesTitleButton = '.completes_title';
                await driver.wait(until.elementLocated(By.css(completesTitleButton)), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(elementIsClicked(completesTitleButton), DEFAULT_WAIT_TIMEOUT);
                await driver.sleep(500); // animations

                await driver.wait(until.elementLocated(
                    By.css('.publication-excerpt-for-edition th .completes_title'),
                ), DEFAULT_WAIT_TIMEOUT);

                const th = '.publication-excerpt-for-edition th .completes_title';
                await driver.wait(elementTextMatches(th, /Annotates Title/, DEFAULT_WAIT_TIMEOUT));

                const saveButton = '.btn-save';
                await driver.wait(elementIsClicked(saveButton), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(stalenessOf(fieldForm, DEFAULT_WAIT_TIMEOUT));
                await waitForPreviewComputing();
            });

            it('should have added custom column with value', async () => {
                await driver.wait(until.elementLocated(By.css('.publication-preview')), DEFAULT_WAIT_TIMEOUT);

                await Promise.all(
                    Array.from(Array(4).keys()).map(index =>
                        driver.wait(
                            until.elementLocated(
                                By.xpath(`//tr[position()=${index + 1}]//td[@class='publication-preview-column genre' and text()='Zero-sum hand game']`),
                            ),
                            DEFAULT_WAIT_TIMEOUT,
                        ),
                    ),
                );
            });
        });

        describe('removing column', async () => {
            let fieldForm;

            it('should add auto configured column when clicking add-column button for an original field', async () => {
                const buttonAddColumn = '.btn-add-column';
                await driver.wait(elementIsClicked(buttonAddColumn), DEFAULT_WAIT_TIMEOUT);
                await driver.sleep(500); // animations

                const buttonAddColumnFromDataset = '.btn-add-column-from-dataset';
                await driver.wait(until.elementLocated(By.css(buttonAddColumnFromDataset)));
                await driver.wait(elementIsClicked(buttonAddColumnFromDataset), DEFAULT_WAIT_TIMEOUT);
                await driver.sleep(1000); // animations

                const buttonExcerptAddColumnName = '.btn-excerpt-add-column-name';
                await driver.wait(until.elementLocated(By.css(buttonExcerptAddColumnName)));
                await driver.wait(elementIsClicked(buttonExcerptAddColumnName), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(until.elementLocated(By.css('#field_form')), DEFAULT_WAIT_TIMEOUT);
                fieldForm = await driver.findElement(By.css('#field_form'));
            });

            it('should change column name', async () => {
                const label = await driver.findElement(By.css('#field_form input[name=label]'));
                await driver.wait(inputElementIsFocusable(label), DEFAULT_WAIT_TIMEOUT);

                await label.clear();
                await label.sendKeys('To Remove');

                const th = '.publication-excerpt-for-edition th';
                await driver.wait(elementTextIs(th, 'To Remove', DEFAULT_WAIT_TIMEOUT));
                const saveButton = '.btn-save';
                await driver.wait(elementIsClicked(saveButton), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(stalenessOf(fieldForm, DEFAULT_WAIT_TIMEOUT));
            });

            it('should have updated the preview', async () => {
                await waitForPreviewComputing();
                const tds = await driver.findElements(By.css('.publication-preview tr:first-child td'));
                expect(tds.length).toEqual(6);
            });

            it('should remove column when clicking btn-excerpt-remove-column button for a field', async () => {
                await driver.wait(until.elementLocated(By.css('.publication-preview')), DEFAULT_WAIT_TIMEOUT);
                const button = await driver.findElement(By.css('.btn-excerpt-remove-column-to_remove'));
                await driver.wait(elementIsClicked(button), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(stalenessOf(button, DEFAULT_WAIT_TIMEOUT));
                await driver.wait(elementsCountIs('.publication-preview th', 5));
                await waitForPreviewComputing();
            });

            it('should have updated the preview', async () => {
                await waitForPreviewComputing();
                const tds = await driver.findElements(By.css('.publication-preview tr:first-child td'));
                expect(tds.length).toEqual(5);
            });
        });

        describe('canceling creation', () => {
            let fieldForm;

            it('should add auto configured column when clicking add-column button for an original field', async () => {
                const buttonAddColumn = '.btn-add-column';
                await driver.wait(elementIsClicked(buttonAddColumn), DEFAULT_WAIT_TIMEOUT);
                await driver.sleep(500); // animations

                const buttonAddColumnFromDataset = '.btn-add-column-from-dataset';
                await driver.wait(until.elementLocated(By.css(buttonAddColumnFromDataset)));
                await driver.wait(elementIsClicked(buttonAddColumnFromDataset), DEFAULT_WAIT_TIMEOUT);
                await driver.sleep(1000); // animations

                const buttonExcerptAddColumnName = '.btn-excerpt-add-column-name';
                await driver.wait(until.elementLocated(By.css(buttonExcerptAddColumnName)));
                await driver.wait(elementIsClicked(buttonExcerptAddColumnName), DEFAULT_WAIT_TIMEOUT);

                await driver.wait(until.elementLocated(By.css('#field_form')), DEFAULT_WAIT_TIMEOUT);
                fieldForm = await driver.findElement(By.css('#field_form'));
            });

            it('should cancel edition when clicking close', async () => {
                const cancelButton = '.btn-exit-column-edition';
                await driver.wait(elementIsClicked(cancelButton), DEFAULT_WAIT_TIMEOUT);
                await driver.wait(stalenessOf(fieldForm, DEFAULT_WAIT_TIMEOUT));
                await driver.sleep(500); // dialog animations
                await waitForPreviewComputing();
            });

            it('should not have added the new column', async () => {
                await waitForPreviewComputing();
                const tds = await driver.findElements(By.css('.publication-preview tr:first-child td'));
                expect(tds.length).toEqual(5);
            });
        });

        describe('Publishing', () => {
            it('should display the "data published" message after publication', async () => {
                const buttonPublish = '.btn-publish';
                await driver.wait(elementIsClicked(buttonPublish), DEFAULT_WAIT_TIMEOUT);
                await navigate('/');
                await goToDetails();
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
                await navigate('/home/dataset');
                await driver.wait(until.elementLocated(By.css('.dataset')), DEFAULT_WAIT_TIMEOUT);
                const headers = await driver.findElements(By.css('.dataset table th'));
                const headersText = await Promise.all(headers.map(h => h.getText()));
                expect(headersText).toEqual(['URI', 'STRONGER THAN', 'NAME', 'TITLE', 'GENRE']);
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
                    const humanStronger = String(stronger).substr(5);
                    expect((rows.find(r => r.uri === humanStronger) || { name: '' }).name).toEqual(expected[name]);
                    expect(title).toEqual('Rock-Paper-Scissor');
                    expect(genre).toEqual('Zero-sum hand game');
                });
            });
        });

        after(async () => {
            await driver.executeScript('localStorage.clear();');
            await driver.executeScript('sessionStorage.clear();');
            await clear();
        });
    });
});
