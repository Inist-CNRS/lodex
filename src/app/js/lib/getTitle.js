import { getCleanHost } from '../../../common/uris';

export default () => {
    const host = getCleanHost();
    /**
     * @type {string}
     */
    const tenant = window.__TENANT__ ?? 'default';

    return host
        ? `${tenant} - ${/https?:\/\/([\w-]+)/.exec(host)[1]}`
        : `${tenant} - example`;
};
