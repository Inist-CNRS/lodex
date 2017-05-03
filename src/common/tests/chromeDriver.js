import webdriver from 'selenium-webdriver';
import logging from 'selenium-webdriver/lib/logging';
import { debug } from 'config';

const DEFAULT_WAIT_TIMEOUT = 5000; // A bit less than mocha's timeout to get explicit errors from selenium


const chromeCapabilities = webdriver.Capabilities.chrome();
if (debug) {
    const prefs = new logging.Preferences();
    prefs.setLevel(logging.Type.BROWSER, logging.Level.DEBUG);
    chromeCapabilities.setLoggingPrefs(prefs);
}

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(chromeCapabilities)
    .usingServer('http://hub:4444/wd/hub')
    .build();

driver.manage()
    .timeouts()
    .implicitlyWait(DEFAULT_WAIT_TIMEOUT);

driver.manage()
    .window()
    .maximize();

export default driver;
