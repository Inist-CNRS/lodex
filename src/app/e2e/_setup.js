import http from 'http';

import api from '../../api';
import driver from '../../common/tests/chromeDriver';
import { clear } from '../../common/tests/fixtures';

before(async function before() {
    await clear();
    this.apiServer = http.createServer(api.callback());
    this.apiServer.listen(3010);
});

after(async function after() {
    this.apiServer.close();
    await driver.quit();
});
