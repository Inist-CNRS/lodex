import http from 'http';
import path from 'path';

import api from '../../api/server';
import driver from '../../common/tests/chromeDriver';
import staticServer from '../../common/tests/staticServer';

before(async function () {
    this.apiServer = http.createServer(api.callback());
    this.apiServer.listen(3010);
    staticServer(
        path.join(__dirname, '../../build'),
        9080
    );
});

after(async function () {
    this.apiServer.close();
    await driver.quit();
});
