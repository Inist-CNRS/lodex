import http from 'http';

import api from '../../api';
import driver from '../../common/tests/chromeDriver';

before(async function before() {
    this.apiServer = http.createServer(api.callback());
    this.apiServer.listen(3010);
});

after(async function after() {
    this.apiServer.close();
    await driver.quit();
});
