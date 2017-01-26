import { until, By } from 'selenium-webdriver';
import driver from '../../common/tests/chromeDriver';

describe('Admin page', function homeTests() {
    this.timeout(15000);

    it('should redirect to the login page if not authenticated', async () => {
        await driver.get('http://localhost:3010/#/admin');
        await driver.wait(until.elementLocated(By.css('#login_form')));
    });
});
