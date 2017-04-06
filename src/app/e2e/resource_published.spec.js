import { until, By } from 'selenium-webdriver';
import expect from 'expect';
import {
    elementTextIs,
    elementTextContains,
    elementIsClicked,
} from 'selenium-smart-wait';

import driver from '../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../common/tests/fixtures';
import fixtures from './resource_published.json';

describe('Resource page when not logged', function resourcePageTest() {
    this.timeout(30000);
    const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

    before(async () => {
        await clear();
        await loadFixtures(fixtures);
        await driver.get('http://localhost:3100/uid:/1');
    });

    it.only('should display all resource properties', async () => {
        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);

        const fullnameLabel = '.detail .property.full_name .property_label.full_name';
        const fullNameLabelElements = await driver.findElements(By.css(fullnameLabel));
        expect(fullNameLabelElements.length).toEqual(1); // Ensure it is not displayed twice as it complete email too
        await driver.wait(elementTextIs(fullnameLabel, 'Full name', DEFAULT_WAIT_TIMEOUT));

        const fullnameScheme = '.detail .property.full_name .property_scheme.full_name';
        await driver.wait(elementTextIs(fullnameScheme, 'http://www.w3.org/ns/person', DEFAULT_WAIT_TIMEOUT));

        await driver.wait(
            elementTextIs('.detail .property.full_name .compose_full_name.property.name .property_value', 'TOOK',
            DEFAULT_WAIT_TIMEOUT),
        );
        await driver.wait(
            elementTextIs('.detail .property.full_name .compose_full_name.property.firstname .property_value', 'PEREGRIN',
            DEFAULT_WAIT_TIMEOUT),
        );

        const mailLabel = '.detail .property.email.completes_fullname .property_label.email';
        const mailLabelElements = await driver.findElements(By.css(mailLabel));
        expect(mailLabelElements.length).toEqual(1); // Ensure it is not displayed twice as it complete fullname too
        await driver.wait(elementTextIs(mailLabel, 'Email', DEFAULT_WAIT_TIMEOUT));

        const mailScheme = '.detail .property.email.completes_fullname .property_scheme.email';
        await driver.wait(elementTextIs(mailScheme, 'http://uri4uri.net/vocab', DEFAULT_WAIT_TIMEOUT));

        const mailValue = '.detail .property.email.completes_fullname .property_value';
        await driver.wait(elementTextIs(mailValue, 'peregrin.took@gondor.net', DEFAULT_WAIT_TIMEOUT));

        const bestFriendLabel = '.detail .property.best_friend_of .property_label';
        await driver.wait(elementTextIs(bestFriendLabel, 'Best Friend Of', DEFAULT_WAIT_TIMEOUT));

        const bestFriendScheme = '.detail .property.best_friend_of .property_scheme.best_friend_of';
        await driver.wait(elementTextIs(bestFriendScheme, 'http://www.w3.org/ns/person', DEFAULT_WAIT_TIMEOUT));

        const bestFriendValue = '.detail .property.best_friend_of .property_value';
        await driver.wait(elementTextIs(bestFriendValue, 'MERIADOC', DEFAULT_WAIT_TIMEOUT));

        const bestFriendLanguage = '.detail .property.best_friend_of .property_language';
        await driver.wait(elementTextIs(bestFriendLanguage, 'FR', DEFAULT_WAIT_TIMEOUT));

        const noteLabel = '.detail .property.note .property_label';
        await driver.wait(elementTextIs(noteLabel, 'note', DEFAULT_WAIT_TIMEOUT));

        const noteValue = '.detail .property.note .property_value';
        await driver.wait(elementTextIs(noteValue, '17/20', DEFAULT_WAIT_TIMEOUT));
    });

    it.only('should not display moderate component when loggedOut', async () => {
        const moderateComponents = await driver.findElements(By.css('.moderate'));
        expect(moderateComponents.length).toBe(0);
    });

    it('should not display hide button when loggedOut', async () => {
        const hideButton = await driver.findElements(By.css('.btn-hide-resource'));
        expect(hideButton.length).toBe(0);
    });

    it('should not display edit button when loggedOut', async () => {
        const editButtons = await driver.findElements(By.css('.edit-field director'));
        expect(editButtons.length).toBe(0);
    });

    it('should display version selector', async () => {
        const selectVersion = await driver.findElement(By.css('.select-version'));
        await driver.wait(
            elementTextContains(selectVersion, '03/03/2017', DEFAULT_WAIT_TIMEOUT),
        );
        await driver.wait(
            elementTextContains(selectVersion, '(LATEST)', DEFAULT_WAIT_TIMEOUT),
        );
        await driver.wait(elementIsClicked(selectVersion));
        await driver.sleep(500);
    });

    it('should list all version', async () => {
        await driver.wait(until.elementLocated(By.css('.version')), DEFAULT_WAIT_TIMEOUT);
        const versions = await driver.findElements(By.css('.version'));

        expect(versions.length).toBe(3);

        const expectedVersion = [
            '01/01/2017',
            '02/02/2017',
            '(latest)',
        ];

        await Promise.all(versions.map((v, index) =>
            v.getText()
            .then((text) => {
                expect(text).toContain(expectedVersion[index]);
            }),
        ));
    });

    it('should select first version', async () => {
        await driver.wait(elementIsClicked('.version_0'));
    });

    it('should display first resource properties', async () => {
        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);

        await driver.wait(
            elementTextContains('.select-version', '01/01/2017', DEFAULT_WAIT_TIMEOUT),
        );

        const fullnameLabel = '.detail .property.full_name .property_label';
        await driver.wait(elementTextIs(fullnameLabel, 'Full name', DEFAULT_WAIT_TIMEOUT));

        const fullnameScheme = '.detail .property.full_name > .property_scheme';
        await driver.wait(elementTextIs(fullnameScheme, 'http://www.w3.org/ns/person', DEFAULT_WAIT_TIMEOUT));

        await driver.wait(
            elementTextIs('.detail .property.full_name .compose_full_name.property.name .property_value', 'TOOK',
            DEFAULT_WAIT_TIMEOUT),
        );
        await driver.wait(
            elementTextIs('.detail .property.full_name .compose_full_name.property.firstname .property_value', 'PEREGRIN',
            DEFAULT_WAIT_TIMEOUT),
        );

        const mailLabel = '.detail .property.email.completes_fullname .property_label';
        await driver.wait(elementTextIs(mailLabel, 'Email', DEFAULT_WAIT_TIMEOUT));

        const mailScheme = '.detail .property.email.completes_fullname > .property_scheme';
        await driver.wait(elementTextIs(mailScheme, 'http://uri4uri.net/vocab', DEFAULT_WAIT_TIMEOUT));

        const mailValue = '.detail .property.email.completes_fullname .property_value';
        await driver.wait(elementTextIs(mailValue, 'peregrin.took@shire.net', DEFAULT_WAIT_TIMEOUT));

        const bestFriendLabel = '.detail .property.best_friend_of .property_label';
        await driver.wait(elementTextIs(bestFriendLabel, 'Best Friend Of', DEFAULT_WAIT_TIMEOUT));

        const bestFriendScheme = '.detail .property.best_friend_of > .property_scheme';
        await driver.wait(elementTextIs(bestFriendScheme, 'http://www.w3.org/ns/person', DEFAULT_WAIT_TIMEOUT));

        const bestFriendValue = '.detail .property.best_friend_of .property_value';
        await driver.wait(elementTextIs(bestFriendValue, 'MERIADOC', DEFAULT_WAIT_TIMEOUT));

        const bestFriendLanguage = '.detail .property.best_friend_of .property_language';
        await driver.wait(elementTextIs(bestFriendLanguage, 'FR', DEFAULT_WAIT_TIMEOUT));
    });

    after(async () => {
        await clear();
        await driver.executeScript('localStorage.clear();');
        await driver.executeScript('sessionStorage.clear();');
    });
});
