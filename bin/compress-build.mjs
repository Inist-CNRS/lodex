// Precompress the front builds so koa-static serves .br/.gz files without compressing at runtime.
// Usage: node bin/compress-build.mjs <build dir>...
/* global process, console */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import zlib from 'node:zlib';

const brotli = promisify(zlib.brotliCompress);
const gzip = promisify(zlib.gzip);
const COMPRESSIBLE = /\.(js|css|svg|json|html|txt)$/;
const MIN_SIZE = 1024;

const compressFile = async (file) => {
    const content = await readFile(file);
    if (content.length < MIN_SIZE) {
        return;
    }
    await Promise.all([
        brotli(content, {
            params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
        }).then((data) => writeFile(`${file}.br`, data)),
        gzip(content, { level: 9 }).then((data) =>
            writeFile(`${file}.gz`, data),
        ),
    ]);
};

for (const dir of process.argv.slice(2)) {
    const files = (await readdir(dir, { recursive: true }))
        .filter((file) => COMPRESSIBLE.test(file))
        .map((file) => path.join(dir, file));
    await Promise.all(files.map(compressFile));
    console.log(`compressed ${files.length} files in ${dir}`);
}
