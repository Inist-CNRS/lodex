import { getCleanHost } from '../../../common/uris';

export default () => {
    const host = getCleanHost();

    return host ? /https?:\/\/([\w-]+)/.exec(host)[1] : 'example';
};
