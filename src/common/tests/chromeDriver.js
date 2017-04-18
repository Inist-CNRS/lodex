import webdriver from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import logging from 'selenium-webdriver/lib/logging';
import { debug } from 'config';

const chromePath = `${__dirname}/../../../${process.env.SELENIUM_BROWSER_BINARY_PATH}`;
const service = new chrome.ServiceBuilder(chromePath).build();
const DEFAULT_WAIT_TIMEOUT = 5000; // A bit less than mocha's timeout to get explicit errors from selenium

chrome.setDefaultService(service);

const chromeCapabilities = webdriver.Capabilities.chrome();
if (debug) {
    const prefs = new logging.Preferences();
    prefs.setLevel(logging.Type.BROWSER, logging.Level.DEBUG);
    chromeCapabilities.setLoggingPrefs(prefs);
}

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(chromeCapabilities)
    .build();

driver.manage()
    .timeouts()
    .implicitlyWait(DEFAULT_WAIT_TIMEOUT);

driver.manage()
    .window()
    .maximize();

export default driver;
