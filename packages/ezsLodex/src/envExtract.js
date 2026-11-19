const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
const LINE = /^([A-Za-z_][A-Za-z0-9_]*)[ \t]*[:=](.*)$/;
const unquote = (v) => v.replace(/^(["'])(.*)\1$/, '$2');

/**
 * Take a `String` starting with a front matter block (delimited by `---`),
 * copy the allowed `NAME: value` (or `NAME=value`) pairs into the environment,
 * and throw the text without the front matter.
 *
 * Only the front matter at the very beginning of the text is parsed: the rest
 * of the text is never modified. The whole front matter is removed, even the
 * lines that are not allowed (they are ignored). If there is no front matter,
 * the text is thrown unchanged.
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

    block[1].split(/\r?\n/).forEach((line) => {
        const m = line.match(LINE);
        if (!m || !allow.includes(m[1])) {
            return;
        }
        if (overwrite || !(m[1] in env)) {
            env[m[1]] = unquote(m[2].trim());
        }
    });

    const rest = text.slice(block[0].length);
    feed.send(rest);
}
