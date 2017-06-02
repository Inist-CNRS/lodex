import { elementIsClicked } from 'selenium-smart-wait';
import { until, By } from 'selenium-webdriver';
import driver from '../../common/tests/chromeDriver';

export default async () => {
    const reviewButton = '.tab-dataset-resources';
    await driver.wait(elementIsClicked(reviewButton), 5000);
    await driver.wait(until.elementLocated(By.xpath('//div[contains(@value,"dataset")]')));
};
