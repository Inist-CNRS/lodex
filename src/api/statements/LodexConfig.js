import { getHost, getCleanHost } from '../../common/uris';
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
        host: getCleanHost(),
        rawHost: getHost(),
        cleanHost: getCleanHost(),
    });
    feed.send(data);
}
