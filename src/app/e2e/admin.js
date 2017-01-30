import { until, By } from 'selenium-webdriver';
import expect from 'expect';
import path from 'path';
import driver from '../../common/tests/chromeDriver';

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
            const csvPath = path.resolve(__dirname, './sample_csv.csv');
            const input = await driver.findElement(By.css('input[name=file]'));
            await input.sendKeys(csvPath);
            await driver.wait(until.elementLocated(By.css('.parsingResult')));
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
        await driver.executeScript('localStorage.clear();');
    });
});
