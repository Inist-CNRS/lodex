import { until, By } from 'selenium-webdriver';
import { elementValueIs, elementIsClicked, elementTextIs, stalenessOf } from 'selenium-smart-wait';

import driver from '../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../common/tests/fixtures';
import fixtures from './home_published.json';
import { inputElementIsFocusable } from '../../common/tests/conditions';
import loginAsJulia from './loginAsJulia';
import gotToDetails from './goToDetails';

describe('Home page with published data when logged as Julia', function homePublishedDataTests() {
    this.timeout(30000);
    const DEFAULT_WAIT_TIMEOUT = 19000; // A bit less than mocha's timeout to get explicit errors from selenium

    before(async () => {
        await clear();
        await loadFixtures(fixtures);
        await loginAsJulia('/');
        await gotToDetails();
    });

    it('should display the list with multiple edit buttons', () =>
        driver.wait(until.elementLocated(By.css('.edit-field.movie'))));

    it('should display the characteristics edition dialog after clicking the edit button', async () => { // eslint-disable-line
        driver.findElement(By.css('.edit-field.movie')).click();

        return driver.wait(until.elementLocated(By.css('#field_form')));
    });

    it('should display the new characteristics after submitting them', async () => {
        await driver.wait(until.elementLocated(By.css('input[name=movie]')), DEFAULT_WAIT_TIMEOUT);
        const input = await driver.findElement(By.css('input[name=movie]'));
        await driver.wait(inputElementIsFocusable(input), DEFAULT_WAIT_TIMEOUT);
        input.sendKeys(' updated');

        const button = await driver.findElement(By.css('.edit-field.save'));
        button.click();

        await driver.wait(until.elementLocated(By.css('.dataset-characteristics')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(
            elementTextIs('.dataset-characteristics .property.movie .property_value', 'LOTR updated',
                DEFAULT_WAIT_TIMEOUT),
        );
    });

    it('should go to detail page when clicking on uri', async () => {
        const firstUriLink = await driver.findElement(By.linkText('1'));
        await driver.wait(elementIsClicked(firstUriLink), DEFAULT_WAIT_TIMEOUT);

        await driver.wait(until.elementLocated(By.css('.resource')));
    });

    it('should display all resource properties', async () => {
        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(
            elementTextIs('.detail .property.full_name .property_label.full_name', 'Full name', DEFAULT_WAIT_TIMEOUT),
        );
        await driver.wait(
            elementTextIs('.detail .property.full_name .property_scheme.full_name', 'http://www.w3.org/ns/person',
                DEFAULT_WAIT_TIMEOUT),
        );

        await driver.wait(
            elementTextIs(
                '.detail .property.full_name .compose_full_name.property.name .property_value',
                'TOOK',
                DEFAULT_WAIT_TIMEOUT),
        );
        await driver.wait(
            elementTextIs(
                '.detail .property.full_name .compose_full_name.property.firstname .property_value',
                'PEREGRIN',
                DEFAULT_WAIT_TIMEOUT,
            ),
        );

        await driver.wait(
            elementTextIs('.detail .property.email.completes_fullname .property_label.email', 'Email', DEFAULT_WAIT_TIMEOUT),
        );
        await driver.wait(
            elementTextIs('.detail .property.email.completes_fullname .property_scheme.email', 'http://uri4uri.net/vocab',
                DEFAULT_WAIT_TIMEOUT),
        );
        await driver.wait(
            elementTextIs('.detail .property.email.completes_fullname .property_value.email', 'peregrin.took@shire.net',
                DEFAULT_WAIT_TIMEOUT),
        );

        await driver.wait(
            elementTextIs('.detail .property.best_friend_of .property_label', 'Best Friend Of', DEFAULT_WAIT_TIMEOUT),
        );
        await driver.wait(
            elementTextIs('.detail .property.best_friend_of .property_scheme', 'http://www.w3.org/ns/person',
                DEFAULT_WAIT_TIMEOUT),
        );
        await driver.wait(
            elementTextIs('.detail .property.best_friend_of .property_value', 'MERIADOC', DEFAULT_WAIT_TIMEOUT));
        await driver.wait(
            elementTextIs('.detail .property.best_friend_of .property_language', 'FR', DEFAULT_WAIT_TIMEOUT));
    });

    let form;

    it('should allow to edit resource properties', async () => {
        await driver.findElement(By.css('.edit-field.email')).click();
        form = driver.findElement(By.css('#field_form'));

        const email = form.findElement(By.css('input[name=email]'));
        await driver.wait(elementValueIs(email, 'peregrin.took@shire.net'), DEFAULT_WAIT_TIMEOUT);

        await driver.wait(inputElementIsFocusable(email), DEFAULT_WAIT_TIMEOUT);
        await email.clear();
        await email.sendKeys('peregrin.took@gondor.net');

        await driver.findElement(By.css('.edit-field.save')).click();
        await driver.wait(until.stalenessOf(form), DEFAULT_WAIT_TIMEOUT);
        await driver.sleep(500);
    });

    it('should save and return to resource page', async () => {
        const fullnameLabel = '.detail .property.full_name .property_label';
        await driver.wait(elementTextIs(fullnameLabel, 'Full name', DEFAULT_WAIT_TIMEOUT));

        const fullnameScheme = '.detail .property.full_name .property_scheme';
        await driver.wait(elementTextIs(fullnameScheme, 'http://www.w3.org/ns/person', DEFAULT_WAIT_TIMEOUT));

        await driver.wait(
            elementTextIs('.detail .property.full_name .compose_full_name.property.name .property_value', 'TOOK',
                DEFAULT_WAIT_TIMEOUT),
        );
        await driver.wait(
            elementTextIs(
                '.detail .property.full_name .compose_full_name.property.firstname .property_value',
                'PEREGRIN',
                DEFAULT_WAIT_TIMEOUT,
            ),
        );

        const mailLabel = '.detail .property.email.completes_fullname .property_label';
        await driver.wait(elementTextIs(mailLabel, 'Email', DEFAULT_WAIT_TIMEOUT));

        const mailScheme = '.detail .property.email.completes_fullname .property_scheme';
        await driver.wait(elementTextIs(mailScheme, 'http://uri4uri.net/vocab', DEFAULT_WAIT_TIMEOUT));

        const mailValue = '.detail .property.email.completes_fullname .property_value';
        await driver.wait(elementTextIs(mailValue, 'peregrin.took@gondor.net', DEFAULT_WAIT_TIMEOUT));

        const bestFriendLabel = '.detail .property.best_friend_of .property_label';
        await driver.wait(elementTextIs(bestFriendLabel, 'Best Friend Of', DEFAULT_WAIT_TIMEOUT));

        const bestFriendScheme = '.detail .property.best_friend_of .property_scheme';
        await driver.wait(elementTextIs(bestFriendScheme, 'http://www.w3.org/ns/person', DEFAULT_WAIT_TIMEOUT));

        const bestFriendLanguage = '.detail .property.best_friend_of .property_language';
        await driver.wait(elementTextIs(bestFriendLanguage, 'FR', DEFAULT_WAIT_TIMEOUT));

        const bestFriendValue = '.detail .property.best_friend_of .property_value';
        await driver.wait(elementTextIs(bestFriendValue, 'MERIADOC', DEFAULT_WAIT_TIMEOUT));
    });

    it('should display the hide modal', async () => {
        await driver.wait(until.elementLocated(By.css('.hide-resource')));
        const button = await driver.findElement(By.css('.hide-resource'));
        await driver.executeScript('document.getElementsByClassName("hide-resource")[0].scrollIntoView(true);');
        await driver.wait(elementIsClicked(button));
        form = driver.findElement(By.css('#hide_resource_form'));
        const reason = form.findElement(By.css('textarea[name=reason]'));

        await driver.wait(inputElementIsFocusable(reason), DEFAULT_WAIT_TIMEOUT);
        await reason.clear();
        await reason.sendKeys('My bad, should not be here');
        await driver.wait(elementIsClicked('.hide-resource.save'), DEFAULT_WAIT_TIMEOUT);
        await driver.wait(stalenessOf(form, DEFAULT_WAIT_TIMEOUT));
    });

    it('should display reason for removal', async () => {
        await driver.wait(until.elementLocated(By.css('.removed-detail')), DEFAULT_WAIT_TIMEOUT);
        const reason = '.reason';
        await driver.wait(elementTextIs(reason, 'My bad, should not be here', DEFAULT_WAIT_TIMEOUT));
    });

    after(async () => {
        await clear();
        await driver.executeScript('localStorage.clear();');
        await driver.executeScript('sessionStorage.clear();');
    });
});
