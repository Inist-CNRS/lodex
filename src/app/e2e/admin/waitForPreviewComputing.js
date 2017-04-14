import { elementIsNotVisible } from 'selenium-smart-wait';
import driver from '../../../common/tests/chromeDriver';

const DEFAULT_WAIT_TIMEOUT = 19000; // A bit less than mocha's timeout to get explicit errors from selenium

export default async () => {
    await driver.wait(elementIsNotVisible('.publication-preview-is-computing', DEFAULT_WAIT_TIMEOUT));
    await driver.sleep(1000);
};
