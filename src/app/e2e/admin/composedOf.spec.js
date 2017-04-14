import { until, By } from 'selenium-webdriver';
import expect from 'expect';
import {
    elementIsClicked,
    stalenessOf,
    elementValueIs,
    elementTextIs,
    elementsCountIs,
} from 'selenium-smart-wait';

import driver from '../../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../../common/tests/fixtures';
import fixtures from './composedOf.json';
import { inputElementIsFocusable } from '../../../common/tests/conditions';
import loginAsJulia from './loginAsJulia';
import waitForPreviewComputing from './waitForPreviewComputing';
import navigate from '../navigate';

describe('Admin', () => {
    describe('composedOf', function homeTests() {
        this.timeout(30000);
        const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

        before(async () => {
            await clear();
            await loadFixtures(fixtures);
            await loginAsJulia('/admin');
            await driver.wait(elementsCountIs('.parsingResult tr td:first-child', 5), DEFAULT_WAIT_TIMEOUT);
        });
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
            await driver.sleep(250);
            await label.sendKeys('Fullname');

            const th = '.publication-excerpt-for-edition th';
            await driver.wait(elementTextIs(th, 'Fullname', DEFAULT_WAIT_TIMEOUT));
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
            value.sendKeys('A value');
            await driver.wait(elementIsClicked('.btn-next'), DEFAULT_WAIT_TIMEOUT);
            await driver.sleep(500); // animations
            await driver.wait(elementIsClicked('.btn-next'), DEFAULT_WAIT_TIMEOUT);
            await driver.sleep(500); // animations
        });

        it('should select first field', async () => {
            await driver.wait(until.elementLocated(By.css('.composite-field')), DEFAULT_WAIT_TIMEOUT);
            await driver.wait(elementIsClicked(By.css('.composite-field-0'), DEFAULT_WAIT_TIMEOUT));
            await driver.wait(elementTextIs('.composite-field-0-uri', 'URI', DEFAULT_WAIT_TIMEOUT));
            await driver.wait(elementTextIs('.composite-field-0-firstname', 'firstname', DEFAULT_WAIT_TIMEOUT));
            await driver.wait(elementTextIs('.composite-field-0-name', 'name', DEFAULT_WAIT_TIMEOUT));
            await driver.wait(elementIsClicked('.composite-field-0-firstname'));
        });

        it('should select second field', async () => {
            await driver.wait(elementIsClicked(By.css('.composite-field-1'), DEFAULT_WAIT_TIMEOUT));
            await driver.wait(elementTextIs('.composite-field-1-uri', 'URI', DEFAULT_WAIT_TIMEOUT));
            await driver.wait(elementTextIs('.composite-field-1-firstname', 'firstname', DEFAULT_WAIT_TIMEOUT));
            await driver.wait(elementTextIs('.composite-field-1-name', 'name', DEFAULT_WAIT_TIMEOUT));
            await driver.wait(elementIsClicked('.composite-field-1-name'));
        });

        it('should add third field', async () => {
            await driver.wait(elementIsClicked('.btn-add-composition-column', DEFAULT_WAIT_TIMEOUT));
            await driver.wait(until.elementLocated(By.css('.composite-field-2')), DEFAULT_WAIT_TIMEOUT);
            await driver.wait(until.elementLocated(By.css('.btn-remove-composite-field-2')), DEFAULT_WAIT_TIMEOUT);
        });

        it('should remove third field', async () => {
            await driver.wait(elementIsClicked('.btn-remove-composite-field-2'), DEFAULT_WAIT_TIMEOUT);
            await driver.wait(elementsCountIs('.composite-field', 2, DEFAULT_WAIT_TIMEOUT));
        });

        it('should save the field', async () => {
            const saveButton = '.btn-save';
            await driver.wait(elementIsClicked(saveButton), DEFAULT_WAIT_TIMEOUT);
            await driver.wait(stalenessOf(fieldForm, DEFAULT_WAIT_TIMEOUT));
            await waitForPreviewComputing();
        });

        it('should have added custom column with composedOf', async () => {
            await driver.wait(until.elementLocated(By.css('.publication-preview')), DEFAULT_WAIT_TIMEOUT);
            const tds = await driver.findElements(By.css('.publication-preview tr td:last-child'));
            expect(tds.length).toBe(6);

            await Promise.all(tds.slice(0, 3).map(td => // last td is the remove button
                driver.wait(elementTextIs(td, 'A value', DEFAULT_WAIT_TIMEOUT))),
            );
        });

        it('should display the published data on the home page', async () => {
            const buttonPublish = '.btn-publish';
            await driver.wait(elementIsClicked(buttonPublish), DEFAULT_WAIT_TIMEOUT);
            await driver.wait(until.elementLocated(By.css('.data-published')), DEFAULT_WAIT_TIMEOUT);

            await navigate('/');
            await driver.wait(until.elementLocated(By.css('.dataset-uri a')), DEFAULT_WAIT_TIMEOUT);
            await driver.wait(elementIsClicked('.dataset-uri a'), DEFAULT_WAIT_TIMEOUT);
            await driver.wait(until.elementLocated(By.css('.compose_fullname.property.firstname')), DEFAULT_WAIT_TIMEOUT);
            await driver.wait(until.elementLocated(By.css('.compose_fullname.property.name')), DEFAULT_WAIT_TIMEOUT);
        });

        after(async () => {
            await driver.executeScript('localStorage.clear();');
            await driver.executeScript('sessionStorage.clear();');
            await clear();
        });
    });
});
