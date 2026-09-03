import config from 'config';
import set from 'lodash/set.js';
/**
 * Laod config en pout some parameter into eze environment
 *
 * ```
 *
 * @name config2env
 * @returns {Object}
 */
export default function config2env(this: any, data: any, feed: any) {
    if (this.isLast()) {
        return feed.close();
    }
    if (this.isFirst()) {
        const envar = this.getEnv();
        const paths = Array().concat(this.getParam('path', []));
        paths.forEach((cur) => {
            if (config.has(cur)) {
                set(envar, cur, config.get(cur));
            }
        });
    }
    return feed.send(data);
}
