import config from 'config';
import Koa from 'koa';

const env = process.env.NODE_ENV || 'development';
const port = process.env.NODE_PORT || config.api_port;

const app = new Koa();

if (!module.parent || module.parent.filename.indexOf('api/index.js') !== -1) {
    app.listen(port);
    appLogger.info(`API server listening on port ${port}`);
    appLogger.info('Press CTRL+C to stop server');
}

export default app;
