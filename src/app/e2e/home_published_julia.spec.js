import { until, By } from 'selenium-webdriver';

import driver from '../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../common/tests/fixtures';
import fixtures from './home_published.json';
import { elementIsClicked, inputElementIsFocusable, elementValueIs } from '../../common/tests/conditions';
import loginAsJulia from './loginAsJulia';

describe('Home page with published data when logged as Julia', function homePublishedDataTests() {
    this.timeout(30000);
    const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

    before(async () => {
        await clear();
        await loadFixtures(fixtures);
        await loginAsJulia('/', '/');
    });

    it('should display the list with an edit button', async () => {
        await driver.wait(until.elementLocated(By.css('.btn-edit-characteristics')), DEFAULT_WAIT_TIMEOUT);
    });

    it('should display the characteristics edition after clicking the edit button', async () => { // eslint-disable-line
        const button = await driver.findElement(By.css('.btn-edit-characteristics'));
        await driver.wait(elementIsClicked(button), DEFAULT_WAIT_TIMEOUT);

        await driver.wait(until.elementLocated(By.css('.dataset-characteristics-edition')), DEFAULT_WAIT_TIMEOUT);
    });

    it('should display the new characteristics after submitting them', async () => {
        await driver.wait(until.elementLocated(By.css('input[name=movie_value]')), DEFAULT_WAIT_TIMEOUT);
        const input = await driver.findElement(By.css('input[name=movie_value]'));
        await driver.wait(inputElementIsFocusable(input), DEFAULT_WAIT_TIMEOUT);
        input.sendKeys(' updated');

        const button = await driver.findElement(By.css('.btn-update-characteristics'));
        button.click();

        await driver.wait(until.elementLocated(By.css('.dataset-characteristics')), DEFAULT_WAIT_TIMEOUT);
        const movieValue = await driver.findElement(By.css('.dataset-characteristics .property.movie .property_value'));
        driver.wait(until.elementTextIs(movieValue, 'LOTR updated'), DEFAULT_WAIT_TIMEOUT);
    });

    it('should go to detail page when clicking on uri', async () => {
        const firstUriLink = await driver.findElement(By.linkText('1'));
        const firstUri = await firstUriLink.getText();
        await driver.wait(elementIsClicked(firstUriLink), DEFAULT_WAIT_TIMEOUT);

        await driver.wait(until.elementLocated(By.css('.title')));
        const title = await driver.findElement(By.css('.title, h1'), DEFAULT_WAIT_TIMEOUT);
        driver.wait(until.elementTextIs(title, firstUri), DEFAULT_WAIT_TIMEOUT);
    });

    it('should display all resource properties', async () => {
        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);
        const fullnameLabel = await driver.findElement(By.css('.detail .property.full_name .property_name'));
        await driver.wait(until.elementTextIs(fullnameLabel, 'Full name'), DEFAULT_WAIT_TIMEOUT);
        const fullnameScheme = await driver.findElement(By.css('.detail .property.full_name > .property_scheme'));
        await driver.wait(until.elementTextIs(fullnameScheme, 'http://www.w3.org/ns/person'), DEFAULT_WAIT_TIMEOUT);
        const fullnameValue = await driver.findElement(By.css('.detail .property.full_name .composite_property_value'));
        await driver.wait(until.elementTextIs(fullnameValue, 'PEREGRIN.TOOK'), DEFAULT_WAIT_TIMEOUT);

        const mailLabel = await driver.findElement(By.css('.detail .property.email.completes_fullname .property_name'));
        await driver.wait(until.elementTextIs(mailLabel, 'Email'), DEFAULT_WAIT_TIMEOUT);
        const mailScheme = await driver.findElement(
            By.css('.detail .property.email.completes_fullname > .property_scheme'),
        );
        await driver.wait(until.elementTextIs(mailScheme, 'http://uri4uri.net/vocab'), DEFAULT_WAIT_TIMEOUT);
        const mailValue = await driver.findElement(
            By.css('.detail .property.email.completes_fullname .property_value'),
        );
        await driver.wait(until.elementTextIs(mailValue, 'peregrin.took@shire.net'), DEFAULT_WAIT_TIMEOUT);

        const bestFriendLabel = await driver.findElement(By.css('.detail .property.best_friend_of .property_name'));
        await driver.wait(until.elementTextIs(bestFriendLabel, 'Best Friend Of'), DEFAULT_WAIT_TIMEOUT);
        const bestFriendScheme = await driver.findElement(By.css('.detail .property.best_friend_of > .property_scheme'));
        await driver.wait(until.elementTextIs(bestFriendScheme, 'http://www.w3.org/ns/person'), DEFAULT_WAIT_TIMEOUT);
        const bestFriendValue = await driver.findElement(By.css('.detail .property.best_friend_of .property_value'));
        await driver.wait(until.elementTextIs(bestFriendValue, 'MERIADOC'), DEFAULT_WAIT_TIMEOUT);
        const bestFriendLanguage = await driver.findElement(By.css('.detail .property.best_friend_of .property_language'));
        await driver.wait(until.elementTextIs(bestFriendLanguage, '(Français)'), DEFAULT_WAIT_TIMEOUT);
    });

    it('should allow to edit resource properties', async () => {
        await driver.findElement(By.css('.edit-resource')).click();
        await driver.wait(until.elementLocated(By.css('.edit-detail')), DEFAULT_WAIT_TIMEOUT);
        const form = driver.findElement(By.css('#resource_form'));
        const name = form.findElement(By.css('input[name=name]'));
        await driver.wait(elementValueIs(name, 'TOOK'), DEFAULT_WAIT_TIMEOUT);
        const firstname = form.findElement(By.css('input[name=firstname]'));
        await driver.wait(elementValueIs(firstname, 'PEREGRIN'), DEFAULT_WAIT_TIMEOUT);
        const email = form.findElement(By.css('input[name=email]'));
        await driver.wait(elementValueIs(email, 'peregrin.took@shire.net'), DEFAULT_WAIT_TIMEOUT);

        await driver.wait(inputElementIsFocusable(email), DEFAULT_WAIT_TIMEOUT);
        await email.clear();
        await email.sendKeys('peregrin.took@gondor.net');
        await driver.findElement(By.css('.save-resource')).click();
    });

    it('should save and return to resource page', async () => {
        await driver.wait(until.elementLocated(By.css('.detail')), DEFAULT_WAIT_TIMEOUT);

        const fullnameLabel = await driver.findElement(By.css('.detail .property.full_name .property_name'));
        await driver.wait(until.elementTextIs(fullnameLabel, 'Full name'), DEFAULT_WAIT_TIMEOUT);
        const fullnameScheme = await driver.findElement(By.css('.detail .property.full_name > .property_scheme'));
        await driver.wait(until.elementTextIs(fullnameScheme, 'http://www.w3.org/ns/person'), DEFAULT_WAIT_TIMEOUT);

        const fullnameValue = await driver.findElement(By.css('.detail .property.full_name .composite_property_value'));
        await driver.wait(until.elementTextIs(fullnameValue, 'PEREGRIN.TOOK'), DEFAULT_WAIT_TIMEOUT);

        const mailLabel = await driver.findElement(By.css('.detail .property.email.completes_fullname .property_name'));
        await driver.wait(until.elementTextIs(mailLabel, 'Email'), DEFAULT_WAIT_TIMEOUT);
        const mailScheme = await driver.findElement(
            By.css('.detail .property.email.completes_fullname > .property_scheme'),
        );
        await driver.wait(until.elementTextIs(mailScheme, 'http://uri4uri.net/vocab'), DEFAULT_WAIT_TIMEOUT);
        const mailValue = await driver.findElement(
            By.css('.detail .property.email.completes_fullname .property_value'),
        );
        await driver.wait(until.elementTextIs(mailValue, 'peregrin.took@gondor.net'), DEFAULT_WAIT_TIMEOUT);

        const bestFriendLabel = await driver.findElement(By.css('.detail .property.best_friend_of .property_name'));
        await driver.wait(until.elementTextIs(bestFriendLabel, 'Best Friend Of'), DEFAULT_WAIT_TIMEOUT);
        const bestFriendScheme = await driver.findElement(By.css('.detail .property.best_friend_of > .property_scheme'));
        await driver.wait(until.elementTextIs(bestFriendScheme, 'http://www.w3.org/ns/person'), DEFAULT_WAIT_TIMEOUT);
        const bestFriendValue = await driver.findElement(By.css('.detail .property.best_friend_of .property_value'));
        const bestFriendLanguage = await driver.findElement(By.css('.detail .property.best_friend_of .property_language'));
        await driver.wait(until.elementTextIs(bestFriendLanguage, '(Français)'), DEFAULT_WAIT_TIMEOUT);

        await driver.wait(until.elementTextIs(bestFriendValue, 'MERIADOC'), DEFAULT_WAIT_TIMEOUT);
    });

    it('should go to hide page', async () => {
        await driver.findElement(By.css('.hide-resource')).click();
        await driver.wait(until.elementLocated(By.css('.hide-detail')), DEFAULT_WAIT_TIMEOUT);
        const form = driver.findElement(By.css('#hide_resource_form'));
        const reason = form.findElement(By.css('textarea[name=reason]'));

        await driver.wait(inputElementIsFocusable(reason), DEFAULT_WAIT_TIMEOUT);
        await reason.clear();
        await reason.sendKeys('My bad, should not be here');
        await driver.findElement(By.css('.hide-resource')).click();
    });

    it('should display reason for removal', async () => {
        await driver.wait(until.elementLocated(By.css('.removed-detail')), DEFAULT_WAIT_TIMEOUT);
        const reason = driver.findElement(By.css('.reason'));
        await driver.wait(until.elementTextIs(reason, 'My bad, should not be here'), DEFAULT_WAIT_TIMEOUT);
    });

    after(async () => {
        await clear();
        await driver.executeScript('localStorage.clear();');
        await driver.executeScript('sessionStorage.clear();');
    });
});
