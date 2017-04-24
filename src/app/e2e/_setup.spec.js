import driver from '../../common/tests/chromeDriver';
import { clear } from '../../common/tests/fixtures';

before(async () => {
    await clear();
});

after(async () => {
    await driver.quit();
});
