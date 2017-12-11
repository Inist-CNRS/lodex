import { getHost } from '../../../common/uris';

export default () => {
    const host = getHost();

    return host ? /https?:\/\/([\w-]+)/.exec(host)[1] : 'example';
};
