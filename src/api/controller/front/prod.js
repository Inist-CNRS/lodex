import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';

export default () => {
    const app = new Koa();
    app.use(serve(path.join(__dirname, '../../../build')));

    return app;
};
