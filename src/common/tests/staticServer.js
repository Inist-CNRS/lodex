const serve = require('koa-static');
const Koa = require('koa');

export default (path, port) => {
    const app = new Koa();
    app.use(serve(path));
    app.listen(port);

    return app;
};
