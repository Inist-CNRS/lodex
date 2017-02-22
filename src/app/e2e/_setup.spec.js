import http from 'http';

import api from '../../api';
import driver from '../../common/tests/chromeDriver';
import { clear } from '../../common/tests/fixtures';

before(async function before() {
    this.timeout(60000);
    await clear();
    this.apiServer = http.createServer(api.callback());
    this.apiServer.listen(3010);

    // Now that our API is handling all webpack builds (prod and dev), we need to warm it up
    await driver.get('http://localhost:3010/');
});

after(async function after() {
    this.apiServer.close();
    await driver.quit();
});
