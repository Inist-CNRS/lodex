/**
 * @param tenant{string|undefined}
 * @param prefix{string|undefined}
 * @return {string}
 */
// @ts-expect-error TS7006
export default (tenant, prefix) => {
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

    return title.join(' - ');
};
