import { getCleanHost } from '../../../common/uris';

const HOST_REGEX = /https?:\/\/([\w-]+)/;

/**
 * @param tenant{string|undefined}
 * @param prefix{string|undefined}
 * @return {string}
 */
// @ts-expect-error TS7006
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
        // @ts-expect-error TS2531
        title.push(HOST_REGEX.exec(host)[1]);
    }

    return title.join(' - ');
};
