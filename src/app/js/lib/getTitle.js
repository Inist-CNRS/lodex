import { getCleanHost } from '../../../common/uris';

const HOST_REGEX = /https?:\/\/([\w-]+)/;

export default (tenant) => {
    const host = getCleanHost();

    /**
     * @type {string[]}
     */
    const title = [];

    if (tenant) {
        title.push(tenant);
    }

    if (host) {
        title.push(HOST_REGEX.exec(host)[1]);
    } else {
        title.push('example');
    }

    return title.join(' - ');
};
