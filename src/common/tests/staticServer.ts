import serve from 'koa-static';
import Koa from 'koa';

export default (path: any, port: any) => {
    const app = new Koa();
    app.use(serve(path));
    app.listen(port);

    return app;
};
