const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
const ENV_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;
const unquote = (v) => v.replace(/^(["'])(.*)\1$/, '$2');

/**
 * Take a `String` starting with a front matter block (delimited by `---`),
 * copy the allowed `NAME: value` (or `NAME=value`) pairs into the environment,
 * and throw the text without those pairs.
 *
 * Only the front matter at the very beginning of the text is parsed: the rest
 * of the text is never modified. If there is no front matter, the text is
 * thrown unchanged. Lines of the block that are not allowed (or not a
 * `NAME: value` pair) are kept in the front matter.
 *
 * Input:
 *
 * ```
 * ---
 * API_KEY: xxxxx
 * OTHER_VAR: "value with spaces"
 * ---
 * some text
 * blablaba
 * ```
 *
 * Script:
 *
 * ```ini
 * [use]
 * plugin = basics
 *
 * [envExtract]
 * allow = API_KEY,OTHER_VAR
 *
 * # the following statements can read the values with env('API_KEY')
 * ```
 *
 * Output:
 *
 * ```
 * some text
 * blablaba
 * ```
 *
 * @name envExtract
 * @param {String|String[]} [allow=[]] names of the variables allowed to be set (array or comma-separated list)
 * @param {Boolean} [overwrite=false] overwrite a variable that is already defined in the environment
 * @returns {String}
 */
export default function envExtract(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

    const text = String(data);
    const block = text.match(FRONT_MATTER);
    if (!block) {
        return feed.send(text);
    }

    const allow = []
        .concat(this.getParam('allow', []))
        .flatMap((v) => String(v).split(','))
        .map((v) => v.trim());
    const overwrite = this.getParam('overwrite', false);
    const env = this.getEnv();

    const remaining = block[1].split(/\r?\n/).filter((line) => {
        const separator = line.search(/[:=]/);
        if (separator === -1) {
            return true;
        }

        const name = line.slice(0, separator).trim();
        if (!ENV_NAME.test(name) || !allow.includes(name)) {
            return true;
        }

        if (overwrite || !(name in env)) {
            env[name] = unquote(line.slice(separator + 1).trim());
        }
        return false;
    });

    const rest = text.slice(block[0].length);
    feed.send(rest);
}
