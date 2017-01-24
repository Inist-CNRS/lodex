import Koa from 'koa';
import route from 'koa-route';
import jwt from 'koa-jwt';
import { auth } from 'config';

import mongoClient from '../../services/mongoClient';
import login from './login';
import upload from './upload';
import parsing from './parsing';

const app = new Koa();

app.use(mongoClient);

app.use(route.post('/login', login));

app.use(jwt({ secret: auth.cookieSecret, cookie: 'lodex_token', key: 'cookie' }));
app.use(jwt({ secret: auth.headerSecret, key: 'header' }));
app.use(route.post('/upload', upload));
app.use(route.get('/parsing', parsing));

export default app;
