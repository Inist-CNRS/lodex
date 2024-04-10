import { getCleanHost } from '../../../common/uris';

const HOST_REGEX = /https?:\/\/([\w-]+)/;

/**
 * @param tenant{string|undefined}
 * @param prefix{string|undefined}
 * @return {string}
 */
export default (tenant, prefix) => {
    const host = getCleanHost();

    /**
     * @type {string[]}
     */
    const title = [];

    if (prefix) {
        title.push(prefix);
    }

    if (tenant) {
        title.push(tenant);
    }

    if (host) {
        title.push(HOST_REGEX.exec(host)[1]);
    }

    return title.join(' - ');
};
