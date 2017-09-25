import { host, cleanHost } from 'config';
import config from '../../../config.json';

export default function LodexConfig(data, feed) {
    if (this.isLast()) {
        feed.close();
        return;
    }
    const target = this.getParam('target', '$config');
    data[target] = {
        ...config,
        host,
        cleanHost,
    };
    feed.send(data);
}
