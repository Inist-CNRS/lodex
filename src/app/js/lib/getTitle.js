import { getCleanHost } from '../../../common/uris';

const HOST_REGEX = /https?:\/\/([\w-]+)/;

export default () => {
    const host = getCleanHost();

    /**
     * @type {string[]}
     */
    const title = [];

    if (window && window.__TENANT__) {
        title.push(window.__TENANT__);
    } else {
        title.push('default');
    }

    if (host) {
        title.push(HOST_REGEX.exec(host)[1]);
    } else {
        title.push('example');
    }

    return title.join(' - ');
};
