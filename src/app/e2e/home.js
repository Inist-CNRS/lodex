import { until, By } from 'selenium-webdriver';
import expect from 'expect';
import driver from '../../common/tests/chromeDriver';

describe('Home page', function () {
    this.timeout(15000);

    it('should display the Appbar with correct title', async () => {
        await driver.get('http://localhost:9080/');
        const appbar = await driver.findElement(By.css('.appbar'));
        const text = await appbar.getText();
        expect(text).toEqual('Lodex');
    });
});
