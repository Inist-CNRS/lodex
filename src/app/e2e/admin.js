import { until, By } from 'selenium-webdriver';
import expect from 'expect';
import path from 'path';
import driver from '../../common/tests/chromeDriver';
import { clear } from '../../common/tests/fixtures';

describe('Admin page', function homeTests() {
    this.timeout(20000);

    describe('Uploading', () => {
        it('should redirect to the login page if not authenticated', async () => {
            await driver.get('http://localhost:3010/#/admin');
            await driver.wait(until.elementLocated(By.css('#login_form')));
        });

        it('should redirect to the admin after successfull login', async () => {
            const username = await driver.findElement(By.css('input[name=username]'));
            const password = await driver.findElement(By.css('input[name=password]'));
            const form = await driver.findElement(By.css('#login_form'));
            await username.clear();
            await username.sendKeys('user');
            await password.clear();
            await password.sendKeys('secret');
            await form.submit();
            await driver.wait(until.elementLocated(By.css('.admin')));
        });

        it('should display the upload component if no dataset has been loaded yet', async () => {
            await driver.wait(until.elementLocated(By.css('.upload')));
        });

        it('should display the parsing result after uploading a csv', async () => {
            const csvPath = path.resolve(__dirname, './linked_sample_csv.csv');
            const input = await driver.findElement(By.css('input[name=file]'));
            await input.sendKeys(csvPath);
            await driver.wait(until.elementLocated(By.css('.parsingResult')));
        });
    });

    describe('AUTOGENERATE_URI', async () => {
        it('should display publication_preview', async () => {
            await driver.wait(until.elementLocated(By.css('.publication-preview')));
        });

        it('should display only uri empty column', async () => {
            const th = await driver.findElement(By.css('.publication-preview th'));
            const text = await th.getText();
            expect(text).toBe('uri');

            const td = await driver.findElements(By.css('.publication-preview tr td:first-child'));
            expect(td.length).toBe(3);
            const tdTexts = await Promise.all(td.map(e => e.getText()));
            expect(tdTexts).toEqual(['', '', '']);
        });

        it('should display form for uri column when clicking on uri column', async () => {
            await driver.findElement(By.css('.publication-preview th')).click();
            await driver.wait(until.elementLocated(By.css('#field_form')));
            const name = await driver.findElement(By.css('#field_form input[name=name]'));
            const label = await driver.findElement(By.css('#field_form input[name=label]'));
            expect(await name.getAttribute('value')).toBe('uri');
            expect(await label.getAttribute('value')).toBe('');
        });

        it('should allow to add a transformer AUTOGENERATE_URI', async () => {
            await driver.findElement(By.css('#field_form .add-transformer')).click();

            await driver.findElement(By.css('.operation')).click();
            await driver.wait(until.elementLocated(By.css('.AUTOGENERATE_URI')));
            await driver.findElement(By.css('.AUTOGENERATE_URI')).click();
        });

        it('should have completed uri column with generated uri', async () => {
            const td = await driver.findElements(By.css('.publication-preview tr td:first-child'));
            expect(td.length).toBe(3);
            const tdTexts = await Promise.all(td.map(e => e.getText()));
            expect(tdTexts).toMatch([/[A-Z0-9]{8}/]);
        });
    });

    describe('Publishing', () => {
        it('should display the "data published" message after publication', async () => {
            await driver.findElement(By.css('.btn-publish')).click();
            await driver.wait(until.elementLocated(By.css('.data-published')));
        });

        it('should not display the upload after publication', async () => {
            const parsingResult = await driver.findElements(By.css('.parsingResult'));
            expect(parsingResult.length).toEqual(0);
        });

        it('should not display the parsing result after publication', async () => {
            const upload = await driver.findElements(By.css('.upload'));
            expect(upload.length).toEqual(0);
        });

        it('should display the published data on the home page', async () => {
            await driver.get('http://localhost:3010/');
            await driver.wait(until.elementLocated(By.css('.dataset')));
        });
    });

    after(async () => {
        await clear();
        await driver.executeScript('localStorage.clear();');
    });
});
