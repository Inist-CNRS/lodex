import { host, cleanHost } from 'config';
import set from 'lodash.set';
import config from '../../../config.json';

export default function LodexConfig(data, feed) {
    if (this.isLast()) {
        feed.close();
        return;
    }
    const target = this.getParam('target', '$config');
    set(data, `${target || '$context'}`, {
        ...config,
        host,
        cleanHost,
    });
    feed.send(data);
}
