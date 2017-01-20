import Koa from 'koa';
import mount from 'koa-mount';

import api from './api';
import front from './front';

const app = new Koa();
app.use(mount('/api', api));
app.use(mount('/', front));

export default app;
