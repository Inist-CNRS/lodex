import { until, By } from 'selenium-webdriver';
import expect from 'expect';
import { elementTextIs, elementIsClicked, elementValueIs } from 'selenium-smart-wait';

import driver from '../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../common/tests/fixtures';
import fixtures from './home_published.json';
import loginAsJulia from './loginAsJulia';

describe('add characteristic', function homePublishedDataTests() {
    this.timeout(30000);
    const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

    before(async () => {
        await clear();
        await loadFixtures(fixtures);
        await loginAsJulia('/', '/');
    });

    it('should display the dataset characteristics', async () => {
        await driver.wait(until.elementLocated(By.css('.dataset-characteristics')), DEFAULT_WAIT_TIMEOUT);
        const datasetCharacteristics = await driver.findElements(By.css('.dataset-characteristics'));
        expect(datasetCharacteristics.length).toEqual(1);
        const properties = await driver.findElements(By.css('.dataset-characteristics .property'));
        expect(properties.length).toEqual(2);

        const movieLabel = '.dataset-characteristics .property.movie .property_label';
        await driver.wait(elementTextIs(movieLabel, 'Movie', DEFAULT_WAIT_TIMEOUT));

        const movieValue = '.dataset-characteristics .property.movie .property_value';
        await driver.wait(elementTextIs(movieValue, 'LOTR', DEFAULT_WAIT_TIMEOUT));

        const authorLabel = '.dataset-characteristics .property.author.completes_movie .property_label';
        await driver.wait(elementTextIs(authorLabel, 'Author', DEFAULT_WAIT_TIMEOUT));

        const authorValue = '.dataset-characteristics .property.author.completes_movie .property_value';
        await driver.wait(elementTextIs(authorValue, 'Peter Jackson', DEFAULT_WAIT_TIMEOUT));
    });

    it('should open addCharacteristic modal', async () => {
        await driver.wait(elementIsClicked('.add-characteristic', DEFAULT_WAIT_TIMEOUT));
        await driver.wait(until.elementLocated(By.css('#add_characteristic_form')));
        const fields = await driver.findElements(By.css('#add_characteristic_form > div'));
        expect(fields.length).toBe(3);

        const labelLabel = await fields[0].findElement(By.css('label'));
        await driver.wait(elementTextIs(labelLabel, 'label', DEFAULT_WAIT_TIMEOUT));
        const labelInput = await fields[0].findElement(By.css('input'));
        await driver.wait(elementValueIs(labelInput, '', DEFAULT_WAIT_TIMEOUT));
        await labelInput.sendKeys('licence');

        const valueLabel = await fields[1].findElement(By.css('label'));
        await driver.wait(elementTextIs(valueLabel, 'value', DEFAULT_WAIT_TIMEOUT));
        const valueInput = await fields[1].findElement(By.css('input'));
        await driver.wait(elementValueIs(valueInput, '', DEFAULT_WAIT_TIMEOUT));
        await valueInput.sendKeys('CECILL');

        const schemeLabel = await fields[2].findElement(By.css('label'));
        await driver.wait(elementTextIs(schemeLabel, 'scheme', DEFAULT_WAIT_TIMEOUT));
        const schemeInput = await fields[2].findElement(By.css('input'));
        await driver.wait(elementValueIs(schemeInput, '', DEFAULT_WAIT_TIMEOUT));

        await driver.wait(elementIsClicked('.add-characteristic.save', DEFAULT_WAIT_TIMEOUT));
    });

    it('should display the new dataset characteristics', async () => {
        await driver.wait(until.elementLocated(By.css('.dataset-characteristics')), DEFAULT_WAIT_TIMEOUT);
        const datasetCharacteristics = await driver.findElements(By.css('.dataset-characteristics'));
        expect(datasetCharacteristics.length).toEqual(1);
        const properties = await driver.findElements(By.css('.dataset-characteristics .property'));
        expect(properties.length).toEqual(3);

        const movieLabel = '.dataset-characteristics .property.movie .property_label';
        await driver.wait(elementTextIs(movieLabel, 'Movie', DEFAULT_WAIT_TIMEOUT));

        const movieValue = '.dataset-characteristics .property.movie .property_value';
        await driver.wait(elementTextIs(movieValue, 'LOTR', DEFAULT_WAIT_TIMEOUT));

        const authorLabel = '.dataset-characteristics .property.author.completes_movie .property_label';
        await driver.wait(elementTextIs(authorLabel, 'Author', DEFAULT_WAIT_TIMEOUT));

        const authorValue = '.dataset-characteristics .property.author.completes_movie .property_value';
        await driver.wait(elementTextIs(authorValue, 'Peter Jackson', DEFAULT_WAIT_TIMEOUT));

        const licenceLabel = '.dataset-characteristics .property.licence .property_label';
        await driver.wait(elementTextIs(licenceLabel, 'licence', DEFAULT_WAIT_TIMEOUT));

        const licenceValue = '.dataset-characteristics .property.licence .property_value';
        await driver.wait(elementTextIs(licenceValue, 'CECILL', DEFAULT_WAIT_TIMEOUT));
    });

    after(async () => {
        await driver.executeScript('localStorage.clear();');
        await driver.executeScript('sessionStorage.clear();');
        await clear();
    });
});
