import { until, By } from 'selenium-webdriver';
import { elementTextIs } from 'selenium-smart-wait';

import driver from '../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../common/tests/fixtures';
import fixtures from './home_published.json';
import loginAsJulia from './loginAsJulia';
import sendKeysToInputByName from './sendKeysToInputByName';

describe('Home page: Creating new resource as Julia', function homePublishedDataTests() {
    this.timeout(30000);
    const DEFAULT_WAIT_TIMEOUT = 19000; // A bit less than mocha's timeout to get explicit errors from selenium

    before(async () => {
        await clear();
        await loadFixtures(fixtures);
        await loginAsJulia('/', '/');
    });

    it('should display the list with multiple edit buttons', () =>
        driver.wait(until.elementLocated(By.css('.create-resource'))));

    it('should display the characteristics edition dialog after clicking the edit button', async () => { // eslint-disable-line
        driver.findElement(By.css('.create-resource')).click();

        return driver.wait(until.elementLocated(By.css('#resource_form')));
    });

    it('should display the new characteristics after submitting them', async () => {
        await sendKeysToInputByName(driver, 'firstname', 'GANDALF');
        await sendKeysToInputByName(driver, 'name', 'THE GREY');
        await sendKeysToInputByName(driver, 'email', 'gandalf@maiar.net');

        await driver.findElement(By.css('.create-resource.save')).click();
    });

    it('should redirect to detail page for new resource', async () => {
        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(
            elementTextIs('.detail .property.full_name .property_label.full_name', 'Full name', DEFAULT_WAIT_TIMEOUT),
        );

        await driver.wait(
            elementTextIs(
                '.detail .property.full_name .compose_full_name.property.name .property_value',
                'THE GREY',
                DEFAULT_WAIT_TIMEOUT),
        );
        await driver.wait(
            elementTextIs(
                '.detail .property.full_name .compose_full_name.property.firstname .property_value',
                'GANDALF',
                DEFAULT_WAIT_TIMEOUT,
            ),
        );

        await driver.wait(
            elementTextIs(
                '.detail .property.email.completes_fullname .property_label.email',
                'Email',
                DEFAULT_WAIT_TIMEOUT,
            ),
        );

        await driver.wait(
            elementTextIs(
                '.detail .property.email.completes_fullname .property_value.email',
                'gandalf@maiar.net',
                DEFAULT_WAIT_TIMEOUT,
            ),
        );
    });

    after(async () => {
        await clear();
        await driver.executeScript('localStorage.clear();');
        await driver.executeScript('sessionStorage.clear();');
    });
});
